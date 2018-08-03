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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiVEZTL1dvcmtJdGVtVHJhY2tpbmcvUmVzdENsaWVudFwiIiwid2VicGFjazovLy8uL3NyYy93aXByaW50LWFkbWluLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcIlZTUy9Db250ZXh0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiVlNTL0NvbnRyb2xzL0RpYWxvZ3NcIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7OztBQ2xGQSxnRDs7Ozs7OztnRUNBQTtBQUNBO0FBQ0Esa0RBQWtELGNBQWM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVCxLQUFLO0FBQ0wsbUNBQW1DLDhCQUE4QixFQUFFO0FBQ25FO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0Msb0JBQW9CO0FBQ25FO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msb0JBQW9CO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxvRUFBb0UsU0FBUztBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxtQ0FBbUMsRUFBRTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUFBOzs7Ozs7OztBQ25SRCxpRDs7Ozs7OztBQ0FBLGlEIiwiZmlsZSI6IndpcHJpbnQtYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjYpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18yX187IiwiZGVmaW5lKFtcInJlcXVpcmVcIiwgXCJleHBvcnRzXCIsIFwiVlNTL0NvbnRleHRcIiwgXCJURlMvV29ya0l0ZW1UcmFja2luZy9SZXN0Q2xpZW50XCIsIFwiVlNTL0NvbnRyb2xzL0RpYWxvZ3NcIl0sIGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBDb250ZXh0LCBXSVRDbGllbnQsIERpYWxvZ3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4gICAgdmFyIHRmc0NvbnRleHQgPSBDb250ZXh0LmdldERlZmF1bHRXZWJDb250ZXh0KCk7XHJcbiAgICB2YXIgZGF0YVNlcnZpY2UgPSBWU1MuZ2V0U2VydmljZShWU1MuU2VydmljZUlkcy5FeHRlbnNpb25EYXRhKTtcclxuICAgIHZhciB3aXRDbGllbnQgPSBXSVRDbGllbnQuZ2V0Q2xpZW50KCk7XHJcbiAgICB2YXIgYWxsRmllbGRzID0gW107XHJcbiAgICB2YXIgc2VsZWN0ZWRGaWVsZHMgPSBbXTtcclxuICAgIHZhciB0eXBlcyA9IFtdO1xyXG4gICAgdmFyIGtleTtcclxuICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xyXG4gICAgdmFyIGFjdGl2ZVR5cGU7XHJcbiAgICB2YXIgYWN0aXZlU2VsZWN0ZWQ7XHJcbiAgICB2YXIgYWN0aXZlQWxsO1xyXG4gICAgdmFyIHR5cGVzTGlzdDtcclxuICAgIGZ1bmN0aW9uIHNlbGVjdFNlbGVjdGVkKG5hbWUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlU2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgJChcIiNzZWxlY3RlZC1cIiArIGFjdGl2ZVNlbGVjdGVkLm5hbWUuc2FuaXRpemUoKSkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWN0aXZlU2VsZWN0ZWQgPSBzZWxlY3RlZEZpZWxkcy5maWx0ZXIoZnVuY3Rpb24gKGZpZWxkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5uYW1lID09PSBuYW1lO1xyXG4gICAgICAgIH0pWzBdO1xyXG4gICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBuYW1lLnNhbml0aXplKCkpLmFkZENsYXNzKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBzZWxlY3RBbGwobmFtZSkge1xyXG4gICAgICAgIGlmIChhY3RpdmVBbGwpIHtcclxuICAgICAgICAgICAgJChcIiNhbGwtXCIgKyBhY3RpdmVBbGwubmFtZS5zYW5pdGl6ZSgpKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhY3RpdmVBbGwgPSBhbGxGaWVsZHMuZmlsdGVyKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlLm5hbWUgPT09IG5hbWU7XHJcbiAgICAgICAgfSlbMF07XHJcbiAgICAgICAgJChcIiNhbGwtXCIgKyBuYW1lLnNhbml0aXplKCkpLmFkZENsYXNzKFwic2VsZWN0ZWRcIik7XHJcbiAgICB9XHJcbiAgICBtYWtlQ2xlYW4oKTtcclxuICAgIHdpdENsaWVudC5nZXRXb3JrSXRlbVR5cGVzKHRmc0NvbnRleHQucHJvamVjdC5uYW1lKS50aGVuKGZ1bmN0aW9uICh3aXR5cGVzKSB7XHJcbiAgICAgICAgd2l0eXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIHR5cGVzLnB1c2godHlwZSk7XHJcbiAgICAgICAgICAgICQoXCIjdHlwZXNMaXN0XCIpLmFwcGVuZChcIjxsaSBpZD1cXFwidHlwZS1cIiArIHR5cGUubmFtZS5zYW5pdGl6ZSgpICsgXCJcXFwiIGNsYXNzPVxcXCJtcy1MaXN0SXRlbVxcXCI+XCIgK1xyXG4gICAgICAgICAgICAgICAgKHR5cGUuY29sb3JcclxuICAgICAgICAgICAgICAgICAgICA/IFwiPHNwYW4gY2xhc3M9XFxcIm1zLUxpc3RJdGVtLWltYWdlXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjogI1wiICsgdHlwZS5jb2xvciArIFwiXFxcIj48L3NwYW4+XCJcclxuICAgICAgICAgICAgICAgICAgICA6IFwiXCIpICtcclxuICAgICAgICAgICAgICAgIChcIjxzcGFuIGNsYXNzPVxcXCJtcy1MaXN0SXRlbS1wcmltYXJ5VGV4dFxcXCI+XCIgKyB0eXBlLm5hbWUgKyBcIjwvc3Bhbj5cIikgK1xyXG4gICAgICAgICAgICAgICAgKFwiPHNwYW4gY2xhc3M9XFxcIm1zLUxpc3RJdGVtLXNlY29uZGFyeVRleHRcXFwiPlwiICsgdHlwZS5kZXNjcmlwdGlvbiArIFwiPC9zcGFuPlwiKSArXHJcbiAgICAgICAgICAgICAgICBcIjwvbGk+XCIpO1xyXG4gICAgICAgICAgICAkKFwiI3R5cGUtXCIgKyB0eXBlLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hEYXRhKHR5cGUubmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICAkKFwiI3NhdmVcIikuY2xpY2soZnVuY3Rpb24gKGUpIHsgcmV0dXJuIHNhdmUoYWN0aXZlVHlwZS5uYW1lKTsgfSk7XHJcbiAgICAkKFwiI2NhbmNlbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIG1ha2VDbGVhbigpO1xyXG4gICAgICAgIHJlZnJlc2hEYXRhKGFjdGl2ZVR5cGUubmFtZSk7XHJcbiAgICB9KTtcclxuICAgIGZ1bmN0aW9uIHNhdmUobmFtZSkge1xyXG4gICAgICAgIHZhciBzYXZlRmllbGRzID0gc2VsZWN0ZWRGaWVsZHMuc2xpY2UoKTtcclxuICAgICAgICBtYWtlQ2xlYW4oKTtcclxuICAgICAgICBhY3RpdmVBbGwgPSBudWxsO1xyXG4gICAgICAgIGFjdGl2ZVNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICBkYXRhU2VydmljZS50aGVuKGZ1bmN0aW9uIChzZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2Uuc2V0VmFsdWUoa2V5LCBzYXZlRmllbGRzLCB7IHNjb3BlVHlwZTogXCJ1c2VyXCIgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoRGF0YShuYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWZyZXNoRGF0YShuYW1lKSB7XHJcbiAgICAgICAgaWYgKGRpcnR5KSB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2dfMSA9IERpYWxvZ3Muc2hvdyhEaWFsb2dzLk1vZGFsRGlhbG9nLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJVbnNhdmVkIENoYW5nZXNcIixcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICQoXCI8cC8+XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiY29uZmlybWF0aW9uLXRleHRcIilcclxuICAgICAgICAgICAgICAgICAgICAuaHRtbChcIkRvIHlvdSB3YW50IHRvIHNhdmUgY2hhbmdlcyBmb3IgPGI+XCIgKyBhY3RpdmVUeXBlLm5hbWUgKyBcIjwvYj4/XCIpLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFNhdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZShuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nXzEuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIE5vOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ha2VDbGVhbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVBbGwgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hEYXRhKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dfMS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgQ2FuY2VsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ18xLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChhY3RpdmVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3R5cGUtXCIgKyBhY3RpdmVUeXBlLm5hbWUuc2FuaXRpemUoKSkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhY3RpdmVUeXBlID0gdHlwZXMuZmlsdGVyKGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZS5uYW1lID09PSBuYW1lO1xyXG4gICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgJChcIiN0eXBlLVwiICsgbmFtZS5zYW5pdGl6ZSgpKS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICBrZXkgPSBcIndpcHJpbnQtXCIgKyBhY3RpdmVUeXBlLm5hbWUuc2FuaXRpemUoKTtcclxuICAgICAgICAgICAgJChcIiNhbGxMaXN0XCIpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgIGFsbEZpZWxkcy5zcGxpY2UoMCwgYWxsRmllbGRzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWRMaXN0XCIpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzLnNwbGljZSgwLCBzZWxlY3RlZEZpZWxkcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBkYXRhU2VydmljZS50aGVuKGZ1bmN0aW9uIChzZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgICAgLmdldFZhbHVlKGtleSwgeyBzY29wZVR5cGU6IFwidXNlclwiIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiI3NlbGVjdGVkTGlzdFwiKS5hcHBlbmQoXCI8bGkgY2xhc3M9XFxcIm1zLUxpc3RJdGVtXFxcIj5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxzcGFuIGNsYXNzPVxcXCJtcy1MaXN0SXRlbS1zZWNvbmRhcnlUZXh0XFxcIj5ObyBTYXZlZCBEYXRhPC9zcGFuPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9saT5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlVHlwZS5maWVsZEluc3RhbmNlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZWN0ZWRGaWVsZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VOYW1lID09PSBzZWxlY3RlZEZpZWxkc1tpXS5yZWZlcmVuY2VOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxGaWVsZHMucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVBbGwoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBtYWtlRGlydHkoKSB7XHJcbiAgICAgICAgaWYgKCFkaXJ0eSkge1xyXG4gICAgICAgICAgICBkaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgICQoXCIjc2F2ZVwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAkKFwiI2NhbmNlbFwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG1ha2VDbGVhbigpIHtcclxuICAgICAgICBkaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICQoXCIjc2F2ZVwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgJChcIiNjYW5jZWxcIikucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG4gICAgICAgIGFjdGl2ZUFsbCA9IG51bGw7XHJcbiAgICAgICAgYWN0aXZlU2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcG9wdWxhdGVBbGwoKSB7XHJcbiAgICAgICAgJChcIiNhbGxMaXN0XCIpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgYWxsRmllbGRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIChhLm5hbWUgPiBiLm5hbWUgPyAxIDogLTEpOyB9KS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAkKFwiI2FsbExpc3RcIikuYXBwZW5kKFwiPGxpIGlkPVxcXCJhbGwtXCIgKyBmaWVsZC5uYW1lLnNhbml0aXplKCkgKyBcIlxcXCIgY2xhc3M9XFxcIm1zLUxpc3RJdGVtXFxcIj5cIiArXHJcbiAgICAgICAgICAgICAgICAoXCI8c3BhbiBjbGFzcz1cXFwibXMtTGlzdEl0ZW0tc2Vjb25kYXJ5VGV4dFxcXCI+XCIgKyBmaWVsZC5uYW1lICsgXCI8L3NwYW4+XCIpICtcclxuICAgICAgICAgICAgICAgIFwiPC9saT5cIik7XHJcbiAgICAgICAgICAgICQoXCIjYWxsLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RBbGwoZmllbGQubmFtZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZGJsY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjcHVzaFwiKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgJChcIiNzZWxlY3RlZExpc3RcIikuaHRtbChcIlwiKTtcclxuICAgICAgICBzZWxlY3RlZEZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkTGlzdFwiKS5hcHBlbmQoXCI8bGkgaWQ9XFxcInNlbGVjdGVkLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpICsgXCJcXFwiIGNsYXNzPVxcXCJtcy1MaXN0SXRlbVxcXCI+XCIgK1xyXG4gICAgICAgICAgICAgICAgKFwiPHNwYW4gY2xhc3M9XFxcIm1zLUxpc3RJdGVtLXNlY29uZGFyeVRleHRcXFwiPlwiICsgZmllbGQubmFtZSArIFwiPC9zcGFuPlwiKSArXHJcbiAgICAgICAgICAgICAgICBcIjwvbGk+XCIpO1xyXG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RTZWxlY3RlZChmaWVsZC5uYW1lKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5kYmxjbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNwb3BcIikuY2xpY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAkKFwiI3B1c2hcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlQWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBhbGxJbmRleCA9IGFsbEZpZWxkcy5pbmRleE9mKGFjdGl2ZUFsbCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCkgPT09IC0xXHJcbiAgICAgICAgICAgICAgICA/IHNlbGVjdGVkRmllbGRzLmxlbmd0aCAtIDFcclxuICAgICAgICAgICAgICAgIDogc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIGFsbEZpZWxkcy5zcGxpY2UoYWxsSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5zcGxpY2Uoc2VsZWN0ZWRJbmRleCArIDEsIDAsIGFjdGl2ZUFsbCk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlQWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChhbGxGaWVsZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNhbGwtXCIgKyBhbGxGaWVsZHNbYWxsRmllbGRzW2FsbEluZGV4XSA/IGFsbEluZGV4IDogYWxsSW5kZXggLSAxXS5uYW1lLnNhbml0aXplKCkpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGwoJChcIiNhbGwtXCIgKyBhbGxGaWVsZHNbYWxsRmllbGRzW2FsbEluZGV4XSA/IGFsbEluZGV4IDogYWxsSW5kZXggLSAxXS5uYW1lLnNhbml0aXplKCkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUFsbCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcG9wdWxhdGVTZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleCArIDFdID8gc2VsZWN0ZWRJbmRleCArIDEgOiBzZWxlY3RlZEluZGV4XS5uYW1lLnNhbml0aXplKCkpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleCArIDFdID8gc2VsZWN0ZWRJbmRleCArIDEgOiBzZWxlY3RlZEluZGV4XS5uYW1lLnNhbml0aXplKCkpKTtcclxuICAgICAgICAgICAgbWFrZURpcnR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKFwiI3BvcFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChhY3RpdmVTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5zcGxpY2Uoc2VsZWN0ZWRJbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGFsbEZpZWxkcy5wdXNoKGFjdGl2ZVNlbGVjdGVkKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVTZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZUFsbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2FsbC1cIiArIGFsbEZpZWxkc1thbGxGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCldLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjYWxsLVwiICsgYWxsRmllbGRzW2FsbEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKV0ubmFtZS5zYW5pdGl6ZSgpKSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZpZWxkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleF0gPyBzZWxlY3RlZEluZGV4IDogc2VsZWN0ZWRJbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleF0gPyBzZWxlY3RlZEluZGV4IDogc2VsZWN0ZWRJbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlU2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ha2VEaXJ0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJChcIiN0b3BcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlU2VsZWN0ZWQgJiYgc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCkgPiAwKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzLnNwbGljZShzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKSwgMSk7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzLnVuc2hpZnQoYWN0aXZlU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1swXS5uYW1lLnNhbml0aXplKCkpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbMF0ubmFtZS5zYW5pdGl6ZSgpKSk7XHJcbiAgICAgICAgICAgIG1ha2VEaXJ0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJChcIiNib3R0b21cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlU2VsZWN0ZWQgJiZcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCkgPCBzZWxlY3RlZEZpZWxkcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpLCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMucHVzaChhY3RpdmVTZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlU2VsZWN0ZWQoKTtcclxuICAgICAgICAgICAgJChcIiNzZWxlY3RlZC1cIiArIHNlbGVjdGVkRmllbGRzW3NlbGVjdGVkRmllbGRzLmxlbmd0aCAtIDFdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkcy5sZW5ndGggLSAxXS5uYW1lLnNhbml0aXplKCkpKTtcclxuICAgICAgICAgICAgbWFrZURpcnR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKFwiI3VwXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGFjdGl2ZVNlbGVjdGVkICYmIHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4IC0gMSwgMCwgYWN0aXZlU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tpbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tpbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkpO1xyXG4gICAgICAgICAgICBtYWtlRGlydHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICQoXCIjZG93blwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChhY3RpdmVTZWxlY3RlZCAmJlxyXG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKSA8IHNlbGVjdGVkRmllbGRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4ICsgMSwgMCwgYWN0aXZlU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkc1tpbmRleCArIDFdID8gaW5kZXggKyAxIDogaW5kZXhdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkc1tpbmRleCArIDFdID8gaW5kZXggKyAxIDogaW5kZXhdLm5hbWUuc2FuaXRpemUoKSkpO1xyXG4gICAgICAgICAgICBtYWtlRGlydHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc2FuaXRpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXFxzL2csIFwiLVwiKS5yZXBsYWNlKC9bXmEtejAtOVxcLV0vZ2ksIFwiXCIpO1xyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIHNjcm9sbChjaGlsZCkge1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSBjaGlsZC5wYXJlbnQoKTtcclxuICAgICAgICBwYXJlbnQuc2Nyb2xsVG9wKGNoaWxkLm9mZnNldCgpLnRvcCAtIHBhcmVudC5vZmZzZXQoKS50b3AgKyBwYXJlbnQuc2Nyb2xsVG9wKCkgLSAyOTYpO1xyXG4gICAgfVxyXG59KTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18yN19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fMjhfXzsiXSwic291cmNlUm9vdCI6IiJ9