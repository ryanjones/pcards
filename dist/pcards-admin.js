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
            key = "pcards-" + activeType.name.sanitize();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiVEZTL1dvcmtJdGVtVHJhY2tpbmcvUmVzdENsaWVudFwiIiwid2VicGFjazovLy8uL3NyYy9wY2FyZHMtYWRtaW4udHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiVlNTL0NvbnRleHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJWU1MvQ29udHJvbHMvRGlhbG9nc1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7O0FDbEZBLGdEOzs7Ozs7O2dFQ0FBO0FBQ0E7QUFDQSxrREFBa0QsY0FBYztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTCxtQ0FBbUMsOEJBQThCLEVBQUU7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxvQkFBb0I7QUFDbkU7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvQkFBb0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRSxTQUFTO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLG1DQUFtQyxFQUFFO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQUE7Ozs7Ozs7O0FDblJELGlEOzs7Ozs7O0FDQUEsaUQiLCJmaWxlIjoicGNhcmRzLWFkbWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDI2KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fMl9fOyIsImRlZmluZShbXCJyZXF1aXJlXCIsIFwiZXhwb3J0c1wiLCBcIlZTUy9Db250ZXh0XCIsIFwiVEZTL1dvcmtJdGVtVHJhY2tpbmcvUmVzdENsaWVudFwiLCBcIlZTUy9Db250cm9scy9EaWFsb2dzXCJdLCBmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cywgQ29udGV4dCwgV0lUQ2xpZW50LCBEaWFsb2dzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuICAgIHZhciB0ZnNDb250ZXh0ID0gQ29udGV4dC5nZXREZWZhdWx0V2ViQ29udGV4dCgpO1xyXG4gICAgdmFyIGRhdGFTZXJ2aWNlID0gVlNTLmdldFNlcnZpY2UoVlNTLlNlcnZpY2VJZHMuRXh0ZW5zaW9uRGF0YSk7XHJcbiAgICB2YXIgd2l0Q2xpZW50ID0gV0lUQ2xpZW50LmdldENsaWVudCgpO1xyXG4gICAgdmFyIGFsbEZpZWxkcyA9IFtdO1xyXG4gICAgdmFyIHNlbGVjdGVkRmllbGRzID0gW107XHJcbiAgICB2YXIgdHlwZXMgPSBbXTtcclxuICAgIHZhciBrZXk7XHJcbiAgICB2YXIgZGlydHkgPSBmYWxzZTtcclxuICAgIHZhciBhY3RpdmVUeXBlO1xyXG4gICAgdmFyIGFjdGl2ZVNlbGVjdGVkO1xyXG4gICAgdmFyIGFjdGl2ZUFsbDtcclxuICAgIHZhciB0eXBlc0xpc3Q7XHJcbiAgICBmdW5jdGlvbiBzZWxlY3RTZWxlY3RlZChuYW1lKSB7XHJcbiAgICAgICAgaWYgKGFjdGl2ZVNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBhY3RpdmVTZWxlY3RlZC5uYW1lLnNhbml0aXplKCkpLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFjdGl2ZVNlbGVjdGVkID0gc2VsZWN0ZWRGaWVsZHMuZmlsdGVyKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmllbGQubmFtZSA9PT0gbmFtZTtcclxuICAgICAgICB9KVswXTtcclxuICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgbmFtZS5zYW5pdGl6ZSgpKS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2VsZWN0QWxsKG5hbWUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlQWxsKSB7XHJcbiAgICAgICAgICAgICQoXCIjYWxsLVwiICsgYWN0aXZlQWxsLm5hbWUuc2FuaXRpemUoKSkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWN0aXZlQWxsID0gYWxsRmllbGRzLmZpbHRlcihmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZS5uYW1lID09PSBuYW1lO1xyXG4gICAgICAgIH0pWzBdO1xyXG4gICAgICAgICQoXCIjYWxsLVwiICsgbmFtZS5zYW5pdGl6ZSgpKS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG4gICAgbWFrZUNsZWFuKCk7XHJcbiAgICB3aXRDbGllbnQuZ2V0V29ya0l0ZW1UeXBlcyh0ZnNDb250ZXh0LnByb2plY3QubmFtZSkudGhlbihmdW5jdGlvbiAod2l0eXBlcykge1xyXG4gICAgICAgIHdpdHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICB0eXBlcy5wdXNoKHR5cGUpO1xyXG4gICAgICAgICAgICAkKFwiI3R5cGVzTGlzdFwiKS5hcHBlbmQoXCI8bGkgaWQ9XFxcInR5cGUtXCIgKyB0eXBlLm5hbWUuc2FuaXRpemUoKSArIFwiXFxcIiBjbGFzcz1cXFwibXMtTGlzdEl0ZW1cXFwiPlwiICtcclxuICAgICAgICAgICAgICAgICh0eXBlLmNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgPyBcIjxzcGFuIGNsYXNzPVxcXCJtcy1MaXN0SXRlbS1pbWFnZVxcXCIgc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6ICNcIiArIHR5cGUuY29sb3IgKyBcIlxcXCI+PC9zcGFuPlwiXHJcbiAgICAgICAgICAgICAgICAgICAgOiBcIlwiKSArXHJcbiAgICAgICAgICAgICAgICAoXCI8c3BhbiBjbGFzcz1cXFwibXMtTGlzdEl0ZW0tcHJpbWFyeVRleHRcXFwiPlwiICsgdHlwZS5uYW1lICsgXCI8L3NwYW4+XCIpICtcclxuICAgICAgICAgICAgICAgIChcIjxzcGFuIGNsYXNzPVxcXCJtcy1MaXN0SXRlbS1zZWNvbmRhcnlUZXh0XFxcIj5cIiArIHR5cGUuZGVzY3JpcHRpb24gKyBcIjwvc3Bhbj5cIikgK1xyXG4gICAgICAgICAgICAgICAgXCI8L2xpPlwiKTtcclxuICAgICAgICAgICAgJChcIiN0eXBlLVwiICsgdHlwZS5uYW1lLnNhbml0aXplKCkpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoRGF0YSh0eXBlLm5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgJChcIiNzYXZlXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7IHJldHVybiBzYXZlKGFjdGl2ZVR5cGUubmFtZSk7IH0pO1xyXG4gICAgJChcIiNjYW5jZWxcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBtYWtlQ2xlYW4oKTtcclxuICAgICAgICByZWZyZXNoRGF0YShhY3RpdmVUeXBlLm5hbWUpO1xyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiBzYXZlKG5hbWUpIHtcclxuICAgICAgICB2YXIgc2F2ZUZpZWxkcyA9IHNlbGVjdGVkRmllbGRzLnNsaWNlKCk7XHJcbiAgICAgICAgbWFrZUNsZWFuKCk7XHJcbiAgICAgICAgYWN0aXZlQWxsID0gbnVsbDtcclxuICAgICAgICBhY3RpdmVTZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgZGF0YVNlcnZpY2UudGhlbihmdW5jdGlvbiAoc2VydmljZSkge1xyXG4gICAgICAgICAgICBzZXJ2aWNlLnNldFZhbHVlKGtleSwgc2F2ZUZpZWxkcywgeyBzY29wZVR5cGU6IFwidXNlclwiIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmVmcmVzaERhdGEobmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVmcmVzaERhdGEobmFtZSkge1xyXG4gICAgICAgIGlmIChkaXJ0eSkge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nXzEgPSBEaWFsb2dzLnNob3coRGlhbG9ncy5Nb2RhbERpYWxvZywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiVW5zYXZlZCBDaGFuZ2VzXCIsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAkKFwiPHAvPlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImNvbmZpcm1hdGlvbi10ZXh0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmh0bWwoXCJEbyB5b3Ugd2FudCB0byBzYXZlIGNoYW5nZXMgZm9yIDxiPlwiICsgYWN0aXZlVHlwZS5uYW1lICsgXCI8L2I+P1wiKSxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBTYXZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmUobmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ18xLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBObzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYWtlQ2xlYW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQWxsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoRGF0YShuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nXzEuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIENhbmNlbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dfMS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgJChcIiN0eXBlLVwiICsgYWN0aXZlVHlwZS5uYW1lLnNhbml0aXplKCkpLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWN0aXZlVHlwZSA9IHR5cGVzLmZpbHRlcihmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGUubmFtZSA9PT0gbmFtZTtcclxuICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICQoXCIjdHlwZS1cIiArIG5hbWUuc2FuaXRpemUoKSkuYWRkQ2xhc3MoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAga2V5ID0gXCJwY2FyZHMtXCIgKyBhY3RpdmVUeXBlLm5hbWUuc2FuaXRpemUoKTtcclxuICAgICAgICAgICAgJChcIiNhbGxMaXN0XCIpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgIGFsbEZpZWxkcy5zcGxpY2UoMCwgYWxsRmllbGRzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWRMaXN0XCIpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzLnNwbGljZSgwLCBzZWxlY3RlZEZpZWxkcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBkYXRhU2VydmljZS50aGVuKGZ1bmN0aW9uIChzZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgICAgLmdldFZhbHVlKGtleSwgeyBzY29wZVR5cGU6IFwidXNlclwiIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiI3NlbGVjdGVkTGlzdFwiKS5hcHBlbmQoXCI8bGkgY2xhc3M9XFxcIm1zLUxpc3RJdGVtXFxcIj5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxzcGFuIGNsYXNzPVxcXCJtcy1MaXN0SXRlbS1zZWNvbmRhcnlUZXh0XFxcIj5ObyBTYXZlZCBEYXRhPC9zcGFuPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9saT5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlVHlwZS5maWVsZEluc3RhbmNlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZWN0ZWRGaWVsZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VOYW1lID09PSBzZWxlY3RlZEZpZWxkc1tpXS5yZWZlcmVuY2VOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxGaWVsZHMucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdWxhdGVBbGwoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBtYWtlRGlydHkoKSB7XHJcbiAgICAgICAgaWYgKCFkaXJ0eSkge1xyXG4gICAgICAgICAgICBkaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgICQoXCIjc2F2ZVwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAkKFwiI2NhbmNlbFwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG1ha2VDbGVhbigpIHtcclxuICAgICAgICBkaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICQoXCIjc2F2ZVwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgJChcIiNjYW5jZWxcIikucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG4gICAgICAgIGFjdGl2ZUFsbCA9IG51bGw7XHJcbiAgICAgICAgYWN0aXZlU2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcG9wdWxhdGVBbGwoKSB7XHJcbiAgICAgICAgJChcIiNhbGxMaXN0XCIpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgYWxsRmllbGRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIChhLm5hbWUgPiBiLm5hbWUgPyAxIDogLTEpOyB9KS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAkKFwiI2FsbExpc3RcIikuYXBwZW5kKFwiPGxpIGlkPVxcXCJhbGwtXCIgKyBmaWVsZC5uYW1lLnNhbml0aXplKCkgKyBcIlxcXCIgY2xhc3M9XFxcIm1zLUxpc3RJdGVtXFxcIj5cIiArXHJcbiAgICAgICAgICAgICAgICAoXCI8c3BhbiBjbGFzcz1cXFwibXMtTGlzdEl0ZW0tc2Vjb25kYXJ5VGV4dFxcXCI+XCIgKyBmaWVsZC5uYW1lICsgXCI8L3NwYW4+XCIpICtcclxuICAgICAgICAgICAgICAgIFwiPC9saT5cIik7XHJcbiAgICAgICAgICAgICQoXCIjYWxsLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RBbGwoZmllbGQubmFtZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZGJsY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjcHVzaFwiKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgJChcIiNzZWxlY3RlZExpc3RcIikuaHRtbChcIlwiKTtcclxuICAgICAgICBzZWxlY3RlZEZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xyXG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkTGlzdFwiKS5hcHBlbmQoXCI8bGkgaWQ9XFxcInNlbGVjdGVkLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpICsgXCJcXFwiIGNsYXNzPVxcXCJtcy1MaXN0SXRlbVxcXCI+XCIgK1xyXG4gICAgICAgICAgICAgICAgKFwiPHNwYW4gY2xhc3M9XFxcIm1zLUxpc3RJdGVtLXNlY29uZGFyeVRleHRcXFwiPlwiICsgZmllbGQubmFtZSArIFwiPC9zcGFuPlwiKSArXHJcbiAgICAgICAgICAgICAgICBcIjwvbGk+XCIpO1xyXG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgZmllbGQubmFtZS5zYW5pdGl6ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RTZWxlY3RlZChmaWVsZC5uYW1lKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5kYmxjbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNwb3BcIikuY2xpY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAkKFwiI3B1c2hcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlQWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBhbGxJbmRleCA9IGFsbEZpZWxkcy5pbmRleE9mKGFjdGl2ZUFsbCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCkgPT09IC0xXHJcbiAgICAgICAgICAgICAgICA/IHNlbGVjdGVkRmllbGRzLmxlbmd0aCAtIDFcclxuICAgICAgICAgICAgICAgIDogc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIGFsbEZpZWxkcy5zcGxpY2UoYWxsSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5zcGxpY2Uoc2VsZWN0ZWRJbmRleCArIDEsIDAsIGFjdGl2ZUFsbCk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlQWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChhbGxGaWVsZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNhbGwtXCIgKyBhbGxGaWVsZHNbYWxsRmllbGRzW2FsbEluZGV4XSA/IGFsbEluZGV4IDogYWxsSW5kZXggLSAxXS5uYW1lLnNhbml0aXplKCkpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGwoJChcIiNhbGwtXCIgKyBhbGxGaWVsZHNbYWxsRmllbGRzW2FsbEluZGV4XSA/IGFsbEluZGV4IDogYWxsSW5kZXggLSAxXS5uYW1lLnNhbml0aXplKCkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUFsbCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcG9wdWxhdGVTZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleCArIDFdID8gc2VsZWN0ZWRJbmRleCArIDEgOiBzZWxlY3RlZEluZGV4XS5uYW1lLnNhbml0aXplKCkpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleCArIDFdID8gc2VsZWN0ZWRJbmRleCArIDEgOiBzZWxlY3RlZEluZGV4XS5uYW1lLnNhbml0aXplKCkpKTtcclxuICAgICAgICAgICAgbWFrZURpcnR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKFwiI3BvcFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChhY3RpdmVTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5zcGxpY2Uoc2VsZWN0ZWRJbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGFsbEZpZWxkcy5wdXNoKGFjdGl2ZVNlbGVjdGVkKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVTZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZUFsbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2FsbC1cIiArIGFsbEZpZWxkc1thbGxGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCldLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjYWxsLVwiICsgYWxsRmllbGRzW2FsbEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKV0ubmFtZS5zYW5pdGl6ZSgpKSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZpZWxkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleF0gPyBzZWxlY3RlZEluZGV4IDogc2VsZWN0ZWRJbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRGaWVsZHNbc2VsZWN0ZWRJbmRleF0gPyBzZWxlY3RlZEluZGV4IDogc2VsZWN0ZWRJbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlU2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ha2VEaXJ0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJChcIiN0b3BcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlU2VsZWN0ZWQgJiYgc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCkgPiAwKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzLnNwbGljZShzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKSwgMSk7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkRmllbGRzLnVuc2hpZnQoYWN0aXZlU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1swXS5uYW1lLnNhbml0aXplKCkpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIHNjcm9sbCgkKFwiI3NlbGVjdGVkLVwiICsgc2VsZWN0ZWRGaWVsZHNbMF0ubmFtZS5zYW5pdGl6ZSgpKSk7XHJcbiAgICAgICAgICAgIG1ha2VEaXJ0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJChcIiNib3R0b21cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlU2VsZWN0ZWQgJiZcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuaW5kZXhPZihhY3RpdmVTZWxlY3RlZCkgPCBzZWxlY3RlZEZpZWxkcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpLCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMucHVzaChhY3RpdmVTZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlU2VsZWN0ZWQoKTtcclxuICAgICAgICAgICAgJChcIiNzZWxlY3RlZC1cIiArIHNlbGVjdGVkRmllbGRzW3NlbGVjdGVkRmllbGRzLmxlbmd0aCAtIDFdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkcy5sZW5ndGggLSAxXS5uYW1lLnNhbml0aXplKCkpKTtcclxuICAgICAgICAgICAgbWFrZURpcnR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKFwiI3VwXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGFjdGl2ZVNlbGVjdGVkICYmIHNlbGVjdGVkRmllbGRzLmluZGV4T2YoYWN0aXZlU2VsZWN0ZWQpID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4IC0gMSwgMCwgYWN0aXZlU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tpbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tpbmRleCAtIDFdLm5hbWUuc2FuaXRpemUoKSkpO1xyXG4gICAgICAgICAgICBtYWtlRGlydHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICQoXCIjZG93blwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChhY3RpdmVTZWxlY3RlZCAmJlxyXG4gICAgICAgICAgICBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKSA8IHNlbGVjdGVkRmllbGRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzZWxlY3RlZEZpZWxkcy5pbmRleE9mKGFjdGl2ZVNlbGVjdGVkKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRGaWVsZHMuc3BsaWNlKGluZGV4ICsgMSwgMCwgYWN0aXZlU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkc1tpbmRleCArIDFdID8gaW5kZXggKyAxIDogaW5kZXhdLm5hbWUuc2FuaXRpemUoKSkuY2xpY2soKTtcclxuICAgICAgICAgICAgc2Nyb2xsKCQoXCIjc2VsZWN0ZWQtXCIgKyBzZWxlY3RlZEZpZWxkc1tzZWxlY3RlZEZpZWxkc1tpbmRleCArIDFdID8gaW5kZXggKyAxIDogaW5kZXhdLm5hbWUuc2FuaXRpemUoKSkpO1xyXG4gICAgICAgICAgICBtYWtlRGlydHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc2FuaXRpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXFxzL2csIFwiLVwiKS5yZXBsYWNlKC9bXmEtejAtOVxcLV0vZ2ksIFwiXCIpO1xyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIHNjcm9sbChjaGlsZCkge1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSBjaGlsZC5wYXJlbnQoKTtcclxuICAgICAgICBwYXJlbnQuc2Nyb2xsVG9wKGNoaWxkLm9mZnNldCgpLnRvcCAtIHBhcmVudC5vZmZzZXQoKS50b3AgKyBwYXJlbnQuc2Nyb2xsVG9wKCkgLSAyOTYpO1xyXG4gICAgfVxyXG59KTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18yN19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fMjhfXzsiXSwic291cmNlUm9vdCI6IiJ9