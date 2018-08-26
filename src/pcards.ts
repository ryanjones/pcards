import WITClient = require("TFS/WorkItemTracking/RestClient");
import Models = require("TFS/WorkItemTracking/Contracts");
import Q = require("q");
const userStoryTemplate = require("./templates/user-story.handlebars");
const bugTemplate = require("./templates/bug.handlebars");

const extensionContext = VSS.getExtensionContext();
const client = WITClient.getClient();

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

const printWorkItems = {
  getMenuItems: (context: any) => {
    let menuItemText = "Pretty Card";
    if (context.workItemIds && context.workItemIds.length > 1) {
      menuItemText = "Pretty Cards";
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
                  bugCard = bugTemplate({
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
                if (page.type !== "User Story" && page.type !== "Bug") {
                  workItems.innerHTML += "<div class='container'>Work item type not supported. Submit pull requests here: https://github.com/ryanjones/pcards</div>";
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

function prepare(workItems: Models.WorkItem[]) {
  return workItems.map(item => {
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
  });
}

VSS.register(
  `${extensionContext.publisherId}.${
    extensionContext.extensionId
  }.print-work-item`,
  printWorkItems
);