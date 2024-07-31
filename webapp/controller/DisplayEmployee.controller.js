sap.ui.define(["./App.controller"], function (BaseController) {
    "use strict";

    return BaseController.extend("zcompanymgmt.controller.DisplayEmployee", {
        onInit: function () {
            this.getModel("Company");
            sap.ui.core.BusyIndicator.hide();
        },

        onDisplayEmployeeNavPress: function () {
            this.getRouter().navTo("RouteView1");
        },
        onPreviewPress: function (oEvent) {
            debugger;
        },
        onCreateTask: function () {
            debugger;
        }
    });
});
