import WITClient = require("TFS/WorkItemTracking/RestClient");
import Models = require("TFS/WorkItemTracking/Contracts");
import moment = require("moment");
import Q = require("q");
const userStoryTemplate = require("./templates/user-story.handlebars");
const butTemplate = require("./templates/bug.handlebars");
import { ContainerItemStatus } from "VSS/FileContainer/Contracts";

const extensionContext = VSS.getExtensionContext();
const vssContext = VSS.getWebContext();
const client = WITClient.getClient();

const fields: Models.WorkItemField[] = [];

interface IQuery {
  id: string;
  isPublic: boolean;
  name: string;
  path: string;
  wiql: string;
}

interface IActionContext {
  id?: number;
  workItemId?: number;
  query?: IQuery;
  queryText?: string;
  ids?: number[];
  workItemIds?: number[];
  columns?: string[];
}

const dummy = [
  { name: "Assigned To", referenceName: "System.AssignedTo" },
  { name: "State", referenceName: "System.State" },
  { name: "Created Date", referenceName: "System.CreatedDate" },
  { name: "Description", referenceName: "System.Description" },
  {
    name: "Acceptance Criteria",
    referenceName: "Microsoft.VSTS.Common.AcceptanceCriteria"
  },
  { name: "History", referenceName: "System.History" }
];

// Utilities
declare global {
  interface String {
    sanitize(): string;
    htmlize(): string;
  }
}

const localeTime = "L LT";

String.prototype.sanitize = function(this: string) {
  return this.replace(/\s/g, "-").replace(/[^a-z0-9\-]/gi, "");
};

String.prototype.htmlize = function(this: string) {
  return this.replace(/<\/*(step|param|desc|comp)(.*?)>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, `"`)
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
};

const printWorkItems = {
  getMenuItems: (context: any) => {
    let menuItemText = "Print Pretty";
    if (context.workItemIds && context.workItemIds.length > 1) {
      menuItemText = "Print Pretty Selection";
    }

    return [
      {
        action: (actionContext: IActionContext) => {
          const wids = actionContext.workItemIds ||
            actionContext.ids || [actionContext.workItemId || actionContext.id];

          return getWorkItems(wids)
            .then(workItems => prepare(workItems))
            .then(pages => {
              return Q.all(pages);
            })
            .then((pages: any) => {
              const workItems = document.createElement("div");
              workItems.setAttribute("class", "container border");

              pages.forEach(page => {
                let bugCard: any;
                let userStoryCard: any;

                if (page.type === "Bug") {
                  bugCard = butTemplate({
                    number: page.id,
                    title: page.title,
                    repro_steps: page.repro_steps,
                    system_info: page.system_info
                  });
                }

                if (page.type === "User Story") {
                  userStoryCard = userStoryTemplate({
                    number: page.id,
                    title: page.title,
                    description: page.description,
                    acceptance_criteria: page.acceptance_criteria
                  });
                }

                if (page.type === "Bug") {
                  workItems.innerHTML += bugCard;
                }
                if (page.type === "User Story") {
                  workItems.innerHTML += userStoryCard;
                }
              });
              document.body.appendChild(workItems);

              setTimeout(() => {
                window.focus(); // needed for IE
                let ieprint = document.execCommand("print", false, null);
                if (!ieprint) {
                  (window as any).print();
                }
                workItems.parentElement.removeChild(workItems);
              }, 1000);
            });
        },
        icon: "static/img/print14.png",
        text: menuItemText,
        title: menuItemText
      } as IContributedMenuItem
    ];
  }
};

// Promises
function getWorkItems(wids: number[]): IPromise<Models.WorkItem[]> {
  return client.getWorkItems(
    wids,
    undefined,
    undefined,
    Models.WorkItemExpand.Fields
  );
}

function getWorkItemFields() {
  return client.getFields();
}

function getFields(
  workItem: Models.WorkItem
): IPromise<Models.WorkItemTypeFieldInstance[]> {
  return VSS.getService(VSS.ServiceIds.ExtensionData).then(
    (service: IExtensionDataService) => {
      return service.getValue<Models.WorkItemTypeFieldInstance[]>(
        `pcards-${workItem.fields["System.WorkItemType"].sanitize()}`,
        {
          scopeType: "user",
          defaultValue: dummy as Models.WorkItemTypeFieldInstance[]
        }
      );
    }
  );
}

function getHistory(workItem: Models.WorkItem) {
  return client.getComments(workItem.id);
}

function prepare(workItems: Models.WorkItem[]) {
  return workItems.map(item => {
    return Q.all([
      getFields(item) as any,
      getHistory(item),
      getWorkItemFields()
    ])
      .then(results => {
        return results;
      })
      .spread(
        (
          fields: Models.WorkItemTypeFieldInstance[],
          history: Models.WorkItemComments,
          allFields: Models.WorkItemField[]
        ) => {
          let result = {};

          if (item.fields["System.WorkItemType"] === "User Story") {
            result = {
              "type": item.fields["System.WorkItemType"],
              "title": item.fields["System.Title"],
              "description":  item.fields["System.Description"],
              "acceptance_criteria":  item.fields["Microsoft.VSTS.Common.AcceptanceCriteria"],
              "id":  item.fields["System.Id"],
            };
          }

          if (item.fields["System.WorkItemType"] === "Bug") {
            result = {
              "type": item.fields["System.WorkItemType"],
              "title": item.fields["System.Title"],
              "repro_steps":  item.fields["Microsoft.VSTS.TCM.ReproSteps"],
              "system_info":  item.fields["Microsoft.VSTS.TCM.SystemInfo"],
              "id":  item.fields["System.Id"],
            };
          }

          return result;
        }
      );
  });
}

VSS.register(
  `${extensionContext.publisherId}.${
    extensionContext.extensionId
  }.print-work-item`,
  printWorkItems
);