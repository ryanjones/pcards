define(["TFS/WorkItemTracking/RestClient","VSS/Context","VSS/Controls/Dialogs"], function(__WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__27__, __WEBPACK_EXTERNAL_MODULE__28__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(27), __webpack_require__(2), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Context, WITClient, Dialogs) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tfsContext = Context.getDefaultWebContext();
    var dataService = VSS.getService(VSS.ServiceIds.ExtensionData);
    var witClient = WITClient.getClient();
    var allFields = [];
    var selectedFields = [];
    var types = [];
    var key;
    var dirty = false;
    var activeType;
    var activeSelected;
    var activeAll;
    var typesList;
    function selectSelected(name) {
        if (activeSelected) {
            $("#selected-" + activeSelected.name.sanitize()).removeClass("selected");
        }
        activeSelected = selectedFields.filter(function (field) {
            return field.name === name;
        })[0];
        $("#selected-" + name.sanitize()).addClass("selected");
    }
    function selectAll(name) {
        if (activeAll) {
            $("#all-" + activeAll.name.sanitize()).removeClass("selected");
        }
        activeAll = allFields.filter(function (type) {
            return type.name === name;
        })[0];
        $("#all-" + name.sanitize()).addClass("selected");
    }
    makeClean();
    witClient.getWorkItemTypes(tfsContext.project.name).then(function (witypes) {
        witypes.forEach(function (type) {
            types.push(type);
            $("#typesList").append("<li id=\"type-" + type.name.sanitize() + "\" class=\"ms-ListItem\">" +
                (type.color
                    ? "<span class=\"ms-ListItem-image\" style=\"background-color: #" + type.color + "\"></span>"
                    : "") +
                ("<span class=\"ms-ListItem-primaryText\">" + type.name + "</span>") +
                ("<span class=\"ms-ListItem-secondaryText\">" + type.description + "</span>") +
                "</li>");
            $("#type-" + type.name.sanitize()).click(function (e) {
                refreshData(type.name);
            });
        });
    });
    $("#save").click(function (e) { return save(activeType.name); });
    $("#cancel").click(function (e) {
        makeClean();
        refreshData(activeType.name);
    });
    function save(name) {
        var saveFields = selectedFields.slice();
        makeClean();
        activeAll = null;
        activeSelected = null;
        dataService.then(function (service) {
            service.setValue(key, saveFields, { scopeType: "user" }).then(function () {
                refreshData(name);
            });
        });
    }
    function refreshData(name) {
        if (dirty) {
            var dialog_1 = Dialogs.show(Dialogs.ModalDialog, {
                title: "Unsaved Changes",
                content: $("<p/>")
                    .addClass("confirmation-text")
                    .html("Do you want to save changes for <b>" + activeType.name + "</b>?"),
                buttons: {
                    Save: function () {
                        save(name);
                        dialog_1.close();
                    },
                    No: function () {
                        makeClean();
                        activeAll = null;
                        activeSelected = null;
                        refreshData(name);
                        dialog_1.close();
                    },
                    Cancel: function () {
                        dialog_1.close();
                    }
                }
            });
        }
        else {
            if (activeType) {
                $("#type-" + activeType.name.sanitize()).removeClass("selected");
            }
            activeType = types.filter(function (type) {
                return type.name === name;
            })[0];
            $("#type-" + name.sanitize()).addClass("selected");
            key = "wiprint-" + activeType.name.sanitize();
            $("#allList").html("");
            allFields.splice(0, allFields.length);
            $("#selectedList").html("");
            selectedFields.splice(0, selectedFields.length);
            dataService.then(function (service) {
                service
                    .getValue(key, { scopeType: "user" })
                    .then(function (data) {
                    if (data && data.length > 0) {
                        data.forEach(function (field) {
                            if (field !== null) {
                                selectedFields.push(field);
                            }
                        });
                        populateSelected();
                    }
                    else {
                        $("#selectedList").append("<li class=\"ms-ListItem\">" +
                            "<span class=\"ms-ListItem-secondaryText\">No Saved Data</span>" +
                            "</li>");
                    }
                })
                    .then(function () {
                    activeType.fieldInstances
                        .filter(function (field) {
                        for (var i = 0, len = selectedFields.length; i < len; i++) {
                            if (field.referenceName === selectedFields[i].referenceName) {
                                return false;
                            }
                        }
                        return true;
                    })
                        .forEach(function (field) {
                        allFields.push(field);
                    });
                    populateAll();
                });
            });
        }
    }
    function makeDirty() {
        if (!dirty) {
            dirty = true;
            $("#save").prop("disabled", false);
            $("#cancel").prop("disabled", false);
        }
    }
    function makeClean() {
        dirty = false;
        $("#save").prop("disabled", true);
        $("#cancel").prop("disabled", true);
        activeAll = null;
        activeSelected = null;
    }
    function populateAll() {
        $("#allList").html("");
        allFields.sort(function (a, b) { return (a.name > b.name ? 1 : -1); }).forEach(function (field) {
            $("#allList").append("<li id=\"all-" + field.name.sanitize() + "\" class=\"ms-ListItem\">" +
                ("<span class=\"ms-ListItem-secondaryText\">" + field.name + "</span>") +
                "</li>");
            $("#all-" + field.name.sanitize())
                .click(function (e) {
                selectAll(field.name);
            })
                .dblclick(function (e) {
                $("#push").click();
            });
        });
    }
    function populateSelected() {
        $("#selectedList").html("");
        selectedFields.forEach(function (field) {
            $("#selectedList").append("<li id=\"selected-" + field.name.sanitize() + "\" class=\"ms-ListItem\">" +
                ("<span class=\"ms-ListItem-secondaryText\">" + field.name + "</span>") +
                "</li>");
            $("#selected-" + field.name.sanitize())
                .click(function (e) {
                selectSelected(field.name);
            })
                .dblclick(function (e) {
                $("#pop").click();
            });
        });
    }
    $("#push").click(function (e) {
        if (activeAll) {
            var allIndex = allFields.indexOf(activeAll);
            var selectedIndex = selectedFields.indexOf(activeSelected) === -1
                ? selectedFields.length - 1
                : selectedFields.indexOf(activeSelected);
            allFields.splice(allIndex, 1);
            selectedFields.splice(selectedIndex + 1, 0, activeAll);
            populateAll();
            if (allFields.length > 0) {
                $("#all-" + allFields[allFields[allIndex] ? allIndex : allIndex - 1].name.sanitize()).click();
                scroll($("#all-" + allFields[allFields[allIndex] ? allIndex : allIndex - 1].name.sanitize()));
            }
            else {
                activeAll = null;
            }
            populateSelected();
            $("#selected-" + selectedFields[selectedFields[selectedIndex + 1] ? selectedIndex + 1 : selectedIndex].name.sanitize()).click();
            scroll($("#selected-" + selectedFields[selectedFields[selectedIndex + 1] ? selectedIndex + 1 : selectedIndex].name.sanitize()));
            makeDirty();
        }
    });
    $("#pop").click(function (e) {
        if (activeSelected) {
            var selectedIndex = selectedFields.indexOf(activeSelected);
            selectedFields.splice(selectedIndex, 1);
            allFields.push(activeSelected);
            populateSelected();
            populateAll();
            $("#all-" + allFields[allFields.indexOf(activeSelected)].name.sanitize()).click();
            scroll($("#all-" + allFields[allFields.indexOf(activeSelected)].name.sanitize()));
            if (selectedFields.length > 0) {
                $("#selected-" + selectedFields[selectedFields[selectedIndex] ? selectedIndex : selectedIndex - 1].name.sanitize()).click();
                scroll($("#selected-" + selectedFields[selectedFields[selectedIndex] ? selectedIndex : selectedIndex - 1].name.sanitize()));
            }
            else {
                activeSelected = null;
            }
            makeDirty();
        }
    });
    $("#top").click(function (e) {
        if (activeSelected && selectedFields.indexOf(activeSelected) > 0) {
            selectedFields.splice(selectedFields.indexOf(activeSelected), 1);
            selectedFields.unshift(activeSelected);
            populateSelected();
            $("#selected-" + selectedFields[0].name.sanitize()).click();
            scroll($("#selected-" + selectedFields[0].name.sanitize()));
            makeDirty();
        }
    });
    $("#bottom").click(function (e) {
        if (activeSelected &&
            selectedFields.indexOf(activeSelected) < selectedFields.length) {
            selectedFields.splice(selectedFields.indexOf(activeSelected), 1);
            selectedFields.push(activeSelected);
            populateSelected();
            $("#selected-" + selectedFields[selectedFields.length - 1].name.sanitize()).click();
            scroll($("#selected-" + selectedFields[selectedFields.length - 1].name.sanitize()));
            makeDirty();
        }
    });
    $("#up").click(function (e) {
        if (activeSelected && selectedFields.indexOf(activeSelected) > 0) {
            var index = selectedFields.indexOf(activeSelected);
            selectedFields.splice(index, 1);
            selectedFields.splice(index - 1, 0, activeSelected);
            populateSelected();
            $("#selected-" + selectedFields[index - 1].name.sanitize()).click();
            scroll($("#selected-" + selectedFields[index - 1].name.sanitize()));
            makeDirty();
        }
    });
    $("#down").click(function (e) {
        if (activeSelected &&
            selectedFields.indexOf(activeSelected) < selectedFields.length) {
            var index = selectedFields.indexOf(activeSelected);
            selectedFields.splice(index, 1);
            selectedFields.splice(index + 1, 0, activeSelected);
            populateSelected();
            $("#selected-" + selectedFields[selectedFields[index + 1] ? index + 1 : index].name.sanitize()).click();
            scroll($("#selected-" + selectedFields[selectedFields[index + 1] ? index + 1 : index].name.sanitize()));
            makeDirty();
        }
    });
    String.prototype.sanitize = function () {
        return this.replace(/\s/g, "-").replace(/[^a-z0-9\-]/gi, "");
    };
    function scroll(child) {
        var parent = child.parent();
        parent.scrollTop(child.offset().top - parent.offset().top + parent.scrollTop() - 296);
    }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 27:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__27__;

/***/ }),

/***/ 28:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__28__;

/***/ })

/******/ })});;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiVEZTL1dvcmtJdGVtVHJhY2tpbmcvUmVzdENsaWVudFwiIiwid2VicGFjazovLy8uL3NyYy93aXByaW50LWFkbWluLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcIlZTUy9Db250ZXh0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiVlNTL0NvbnRyb2xzL0RpYWxvZ3NcIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7OztBQ2xGQSxnRDs7Ozs7OztnRUNBQTtBQUNBO0FBQ0Esa0RBQWtELGNBQWM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVCxLQUFLO0FBQ0wsbUNBQW1DLDhCQUE4QixFQUFFO0FBQ25FO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0Msb0JBQW9CO0FBQ25FO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msb0JBQW9CO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxvRUFBb0UsU0FBUztBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxtQ0FBbUMsRUFBRTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUFBOzs7Ozs7OztBQ25SRCxpRDs7Ozs7OztBQ0FBLGlEIiwiZmlsZSI6IndpcHJpbnQtYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjYpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18yX187IiwiZGVmaW5lKFtcInJlcXVpcmVcIiwgXCJleHBvcnRzXCIsIFwiVlNTL0NvbnRleHRcIiwgXCJURlMvV29ya0l0ZW1UcmFja2luZy9SZXN0Q2xpZW50XCIsIFwiVlNTL0NvbnRyb2xzL0RpYWxvZ3NcIl0sIGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBDb250ZXh0LCBXSVRDbGllbnQsIERpYWxvZ3MpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4gICAgdmFyIHRmc0NvbnRleHQgPSBDb250ZXh0LmdldERlZmF1bHRXZWJDb250ZXh0KCk7XG4gICAgdmFyIGRhdGFTZXJ2aWNlID0gVlNTLmdldFNlcnZpY2UoVlNTLlNlcnZpY2VJZHMuRXh0ZW5zaW9uRGF0YSk7XG4gICAgdmFyIHdpdENsaWVudCA9IFdJVENsaWVudC5nZXRDbGllbnQoKTtcbiAgICB2YXIgYWxsRmllbGRzID0gW107XG4gICAgdmFyIHNlbGVjdGVkRmllbGRzID0gW107XG4gICAgdmFyIHR5cGVzID0gW107XG4gICAgdmFyIGtleTtcbiAgICB2YXIgZGlydHkgPSBmYWxzZTtcbiAgICB2YXIgYWN0aXZlVHlwZTtcbiAgICB2YXIgYWN0aXZlU2VsZWN0ZWQ7XG4gICAgdmFyIGFjdGl2ZUFsbDtcbiAgICB2YXIgdHlwZXNMaXN0O1xuICAgIGZ1bmN0aW9uIHNlbGVjdFNlbGVjdGVkKG5hbWUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZVNlbGVjdGVkKSB7XG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgYWN0aXZlU2VsZWN0ZWQubmFtZS5zYW5pdGl6ZSgpKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGFjdGl2ZVNlbGVjdGVkID0gc2VsZWN0ZWRGaWVsZHMuZmlsdGVyKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLm5hbWUgPT09IG5hbWU7XG4gICAgICAgIH0pWzBdO1xuICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgbmFtZS5zYW5pdGl6ZSgpKS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZWxlY3RBbGwobmFtZSkge1xuICAgICAgICBpZiAoYWN0aXZlQWxsKSB7XG4gICAgICAgICAgICAkKFwiI2FsbC1cIiArIGFjdGl2ZUFsbC5uYW1lLnNhbml0aXplKCkpLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgYWN0aXZlQWxsID0gYWxsRmllbGRzLmZpbHRlcihmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGUubmFtZSA9PT0gbmFtZTtcbiAgICAgICAgfSlbMF07XG4gICAgICAgICQoXCIjYWxsLVwiICsgbmFtZS5zYW5pdGl6ZSgpKS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgIH1cbiAgICBtYWtlQ2xlYW4oKTtcbiAgICB3aXRDbGllbnQuZ2V0V29ya0l0ZW1UeXBlcyh0ZnNDb250ZXh0LnByb2plY3QubmFtZSkudGhlbihmdW5jdGlvbiAod2l0eXBlcykge1xuICAgICAgICB3aXR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgICAgIHR5cGVzLnB1c2godHlwZSk7XG4gICAgICAgICAgICAkKFwiI3R5cGVzTGlzdFwiKS5hcHBlbmQoXCI8bGkgaWQ9XFxcInR5cGUtXCIgKyB0eXBlLm5hbWUuc2FuaXRpemUoKSArIFwiXFxcIiBjbGFzcz1cXFwibXMtTGlzdEl0ZW1cXFwiPlwiICtcbiAgICAgICAgICAgICAgICAodHlwZS5jb2xvclxuICAgICAgICAgICAgICAgICAgICA/IFwiPHNwYW4gY2xhc3M9XFxcIm1zLUxpc3RJdGVtLWltYWdlXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjogI1wiICsgdHlwZS5jb2xvciArIFwiXFxcIj48L3NwYW4+XCJcbiAgICAgICAgICAgICAgICAgICAgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgKFwiPHNwYW4gY2xhc3M9XFxcIm1zLUxpc3RJdGVtLXByaW1hcnlUZXh0XFxcIj5cIiArIHR5cGUubmFtZSArIFwiPC9zcGFuPlwiKSArXG4gICAgICAgICAgICAgICAgKFwiPHNwYW4gY2xhc3M9XFxcIm1zLUxpc3RJdGVtLXNlY29uZGFyeVRleHRcXFwiPlwiICsgdHlwZS5kZXNjcmlwdGlvbiArIFwiPC9zcGFuPlwiKSArXG4gICAgICAgICAgICAgICAgXCI8L2xpPlwiKTtcbiAgICAgICAgICAgICQoXCIjdHlwZS1cIiArIHR5cGUubmFtZS5zYW5pdGl6ZSgpKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJlZnJlc2hEYXRhKHR5cGUubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJChcIiNzYXZlXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7IHJldHVybiBzYXZlKGFjdGl2ZVR5cGUubmFtZSk7IH0pO1xuICAgICQoXCIjY2FuY2VsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIG1ha2VDbGVhbigpO1xuICAgICAgICByZWZyZXNoRGF0YShhY3RpdmVUeXBlLm5hbWUpO1xuICAgIH0pO1xuICAgIGZ1bmN0aW9uIHNhdmUobmFtZSkge1xuICAgICAgICB2YXIgc2F2ZUZpZWxkcyA9IHNlbGVjdGVkRmllbGRzLnNsaWNlKCk7XG4gICAgICAgIG1ha2VDbGVhbigpO1xuICAgICAgICBhY3RpdmVBbGwgPSBudWxsO1xuICAgICAgICBhY3RpdmVTZWxlY3RlZCA9IG51bGw7XG4gICAgICAgIGRhdGFTZXJ2aWNlLnRoZW4oZnVuY3Rpb24gKHNlcnZpY2UpIHtcbiAgICAgICAgICAgIHNlcnZpY2Uuc2V0VmFsdWUoa2V5LCBzYXZlRmllbGRzLCB7IHNjb3BlVHlwZTogXCJ1c2VyXCIgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVmcmVzaERhdGEobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlZnJlc2hEYXRhKG5hbWUpIHtcbiAgICAgICAgaWYgKGRpcnR5KSB7XG4gICAgICAgICAgICB2YXIgZGlhbG9nXzEgPSBEaWFsb2dzLnNob3coRGlhbG9ncy5Nb2RhbERpYWxvZywge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlVuc2F2ZWQgQ2hhbmdlc1wiLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICQoXCI8cC8+XCIpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImNvbmZpcm1hdGlvbi10ZXh0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5odG1sKFwiRG8geW91IHdhbnQgdG8gc2F2ZSBjaGFuZ2VzIGZvciA8Yj5cIiArIGFjdGl2ZVR5cGUubmFtZSArIFwiPC9iPj9cIiksXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgICAgICAgICBTYXZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nXzEuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgTm86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ha2VDbGVhbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQWxsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hEYXRhKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nXzEuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgQ2FuY2VsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dfMS5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoYWN0aXZlVHlwZSkge1xuICAgICAgICAgICAgICAgICQoXCIjdHlwZS1cIiArIGFjdGl2ZVR5cGUubmFtZS5zYW5pdGl6ZSgpKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWN0aXZlVHlwZSA9IHR5cGVzLmZpbHRlcihmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlLm5hbWUgPT09IG5hbWU7XG4gICAgICAgICAgICB9KVswXTtcbiAgICAgICAgICAgICQoXCIjdHlwZS1cIiArIG5hbWUuc2FuaXRpemUoKSkuYWRkQ2xhc3MoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgIGtleSA9IFwid2lwcmludC1cIiArIGFjdGl2ZVR5cGUubmFtZS5zYW5pdGl6ZSgpO1xuICAgICAgICAgICAgJChcIiNhbGxMaXN0XCIpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICBhbGxGaWVsZHMuc3BsaWNlKDAsIGFsbEZpZWxkcy5sZW5ndGgpO1xuICAgICAgICAgICAgJChcIiNzZWxlY3RlZExpc3RcIikuaHRtbChcIlwiKTtcbiAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzLnNwbGljZSgwLCBzZWxlY3RlZEZpZWxkcy5sZW5ndGgpO1xuICAgICAgICAgICAgZGF0YVNlcnZpY2UudGhlbihmdW5jdGlvbiAoc2VydmljZSkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgLmdldFZhbHVlKGtleSwgeyBzY29wZVR5cGU6IFwidXNlclwiIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVsYXRlU2VsZWN0ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjc2VsZWN0ZWRMaXN0XCIpLmFwcGVuZChcIjxsaSBjbGFzcz1cXFwibXMtTGlzdEl0ZW1cXFwiPlwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxzcGFuIGNsYXNzPVxcXCJtcy1MaXN0SXRlbS1zZWNvbmRhcnlUZXh0XFxcIj5ObyBTYXZlZCBEYXRhPC9zcGFuPlwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvbGk+XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVUeXBlLmZpZWxkSW5zdGFuY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGVjdGVkRmllbGRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZU5hbWUgPT09IHNlbGVjdGVkRmllbGRzW2ldLnJlZmVyZW5jZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxGaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZUFsbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZURpcnR5KCkge1xuICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAkKFwiI3NhdmVcIikucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICQoXCIjY2FuY2VsXCIpLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gbWFrZUNsZWFuKCkge1xuICAgICAgICBkaXJ0eSA9IGZhbHNlO1xuICAgICAgICAkKFwiI3NhdmVcIikucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKFwiI2NhbmNlbFwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgIGFjdGl2ZUFsbCA9IG51bGw7XG4gICAgICAgIGFjdGl2ZVNlbGVjdGVkID0gbnVsbDtcbiAgICB9XG4gICAgZnVuY3Rpb24gcG9wdWxhdGVBbGwoKSB7XG4gICAgICAgICQoXCIjYWxsTGlzdFwiKS5odG1sKFwiXCIpO1xuICAgICAgICBhbGxGaWVsZHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gKGEubmFtZSA+IGIubmFtZSA/IDEgOiAtMSk7IH0pLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgICAgICAkKFwiI2FsbExpc3RcIikuYXBwZW5kKFwiPGxpIGlkPVxcXCJhbGwtXCIgKyBmaWVsZC5uYW1lLnNhbml0aXplKCkgKyBcIlxcXCIgY2xhc3M9XFxcIm1zLUxpc3RJdGVtXFxcIj5cIiArXG4gICAgICAgICAgICAgICAgKFwiPHNwYW4gY2xhc3M9XFxcIm1zLUxpc3RJdGVtLXNlY29uZGFyeVRleHRcXFwiPlwiICsgZmllbGQubmFtZSArIFwiPC9zcGFuPlwiKSArXG4gICAgICAgICAgICAgICAgXCI8L2xpPlwiKTtcbiAgICAgICAgICAgICQoXCIjYWxsLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpKVxuICAgICAgICAgICAgICAgIC5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdEFsbChmaWVsZC5uYW1lKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRibGNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgJChcIiNwdXNoXCIpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2VsZWN0ZWQoKSB7XG4gICAgICAgICQoXCIjc2VsZWN0ZWRMaXN0XCIpLmh0bWwoXCJcIik7XG4gICAgICAgIHNlbGVjdGVkRmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkTGlzdFwiKS5hcHBlbmQoXCI8bGkgaWQ9XFxcInNlbGVjdGVkLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpICsgXCJcXFwiIGNsYXNzPVxcXCJtcy1MaXN0SXRlbVxcXCI+XCIgK1xuICAgICAgICAgICAgICAgIChcIjxzcGFuIGNsYXNzPVxcXCJtcy1MaXN0SXRlbS1zZWNvbmRhcnlUZXh0XFxcIj5cIiArIGZpZWxkLm5hbWUgKyBcIjwvc3Bhbj5cIikgK1xuICAgICAgICAgICAgICAgIFwiPC9saT5cIik7XG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpKVxuICAgICAgICAgICAgICAgIC5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdFNlbGVjdGVkKGZpZWxkLm5hbWUpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZGJsY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAkKFwiI3BvcFwiKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAkKFwiI3B1c2hcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZUFsbCkge1xuICAgICAgICAgICAgdmFyIGFsbEluZGV4ID0gYWxsRmllbGRzLmluZGV4T2YoYWN0aXZlQWxsKTtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCkgPT09IC0xXG4gICAgICAgICAgICAgICAgPyBzZWxlY3RlZEZpZWxkcy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgOiBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKTtcbiAgICAgICAgICAgIGFsbEZpZWxkcy5zcGxpY2UoYWxsSW5kZXgsIDEpO1xuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKHNlbGVjdGVkSW5kZXggKyAxLCAwLCBhY3RpdmVBbGwpO1xuICAgICAgICAgICAgcG9wdWxhdGVBbGwoKTtcbiAgICAgICAgICAgIGlmIChhbGxGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICQoXCIjYWxsLVwiICsgYWxsRmllbGRzW2FsbEZpZWxkc1thbGxJbmRleF0gPyBhbGxJbmRleCA6IGFsbEluZGV4IC0gMV0ubmFtZS5zYW5pdGl6ZSgpKS5jbGljaygpO1xuICAgICAgICAgICAgICAgIHNjcm9sbCgkKFwiI2FsbC1cIiArIGFsbEZpZWxkc1thbGxGaWVsZHNbYWxsSW5kZXhdID8gYWxsSW5kZXggOiBhbGxJbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlQWxsID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvcHVsYXRlU2VsZWN0ZWQoKTtcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEluZGV4ICsgMV0gPyBzZWxlY3RlZEluZGV4ICsgMSA6IHNlbGVjdGVkSW5kZXhdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcbiAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleCArIDFdID8gc2VsZWN0ZWRJbmRleCArIDEgOiBzZWxlY3RlZEluZGV4XS5uYW1lLnNhbml0aXplKCkpKTtcbiAgICAgICAgICAgIG1ha2VEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJChcIiNwb3BcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZVNlbGVjdGVkKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpO1xuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKHNlbGVjdGVkSW5kZXgsIDEpO1xuICAgICAgICAgICAgYWxsRmllbGRzLnB1c2goYWN0aXZlU2VsZWN0ZWQpO1xuICAgICAgICAgICAgcG9wdWxhdGVTZWxlY3RlZCgpO1xuICAgICAgICAgICAgcG9wdWxhdGVBbGwoKTtcbiAgICAgICAgICAgICQoXCIjYWxsLVwiICsgYWxsRmllbGRzW2FsbEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKV0ubmFtZS5zYW5pdGl6ZSgpKS5jbGljaygpO1xuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjYWxsLVwiICsgYWxsRmllbGRzW2FsbEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKV0ubmFtZS5zYW5pdGl6ZSgpKSk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEluZGV4XSA/IHNlbGVjdGVkSW5kZXggOiBzZWxlY3RlZEluZGV4IC0gMV0ubmFtZS5zYW5pdGl6ZSgpKS5jbGljaygpO1xuICAgICAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleF0gPyBzZWxlY3RlZEluZGV4IDogc2VsZWN0ZWRJbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlU2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFrZURpcnR5KCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKFwiI3RvcFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoYWN0aXZlU2VsZWN0ZWQgJiYgc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCkgPiAwKSB7XG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5zcGxpY2Uoc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCksIDEpO1xuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMudW5zaGlmdChhY3RpdmVTZWxlY3RlZCk7XG4gICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbMF0ubmFtZS5zYW5pdGl6ZSgpKS5jbGljaygpO1xuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1swXS5uYW1lLnNhbml0aXplKCkpKTtcbiAgICAgICAgICAgIG1ha2VEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJChcIiNib3R0b21cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZVNlbGVjdGVkICYmXG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKSA8IHNlbGVjdGVkRmllbGRzLmxlbmd0aCkge1xuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpLCAxKTtcbiAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzLnB1c2goYWN0aXZlU2VsZWN0ZWQpO1xuICAgICAgICAgICAgcG9wdWxhdGVTZWxlY3RlZCgpO1xuICAgICAgICAgICAgJChcIiNzZWxlY3RlZC1cIiArIHNlbGVjdGVkRmllbGRzW3NlbGVjdGVkRmllbGRzLmxlbmd0aCAtIDFdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcbiAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHMubGVuZ3RoIC0gMV0ubmFtZS5zYW5pdGl6ZSgpKSk7XG4gICAgICAgICAgICBtYWtlRGlydHkoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoXCIjdXBcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZVNlbGVjdGVkICYmIHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpID4gMCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCk7XG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4IC0gMSwgMCwgYWN0aXZlU2VsZWN0ZWQpO1xuICAgICAgICAgICAgcG9wdWxhdGVTZWxlY3RlZCgpO1xuICAgICAgICAgICAgJChcIiNzZWxlY3RlZC1cIiArIHNlbGVjdGVkRmllbGRzW2luZGV4IC0gMV0ubmFtZS5zYW5pdGl6ZSgpKS5jbGljaygpO1xuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tpbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkpO1xuICAgICAgICAgICAgbWFrZURpcnR5KCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKFwiI2Rvd25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZVNlbGVjdGVkICYmXG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKSA8IHNlbGVjdGVkRmllbGRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCk7XG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4ICsgMSwgMCwgYWN0aXZlU2VsZWN0ZWQpO1xuICAgICAgICAgICAgcG9wdWxhdGVTZWxlY3RlZCgpO1xuICAgICAgICAgICAgJChcIiNzZWxlY3RlZC1cIiArIHNlbGVjdGVkRmllbGRzW3NlbGVjdGVkRmllbGRzW2luZGV4ICsgMV0gPyBpbmRleCArIDEgOiBpbmRleF0ubmFtZS5zYW5pdGl6ZSgpKS5jbGljaygpO1xuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkc1tpbmRleCArIDFdID8gaW5kZXggKyAxIDogaW5kZXhdLm5hbWUuc2FuaXRpemUoKSkpO1xuICAgICAgICAgICAgbWFrZURpcnR5KCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBTdHJpbmcucHJvdG90eXBlLnNhbml0aXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9cXHMvZywgXCItXCIpLnJlcGxhY2UoL1teYS16MC05XFwtXS9naSwgXCJcIik7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBzY3JvbGwoY2hpbGQpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IGNoaWxkLnBhcmVudCgpO1xuICAgICAgICBwYXJlbnQuc2Nyb2xsVG9wKGNoaWxkLm9mZnNldCgpLnRvcCAtIHBhcmVudC5vZmZzZXQoKS50b3AgKyBwYXJlbnQuc2Nyb2xsVG9wKCkgLSAyOTYpO1xuICAgIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18yN19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fMjhfXzsiXSwic291cmNlUm9vdCI6IiJ9