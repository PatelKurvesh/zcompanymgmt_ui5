sap.ui.define(["sap/ui/core/mvc/Controller"], function (BaseController) {
    "use strict";

    return BaseController.extend("zcompanymgmt.controller.App", {
        onInit: function () {},

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        getControl: function (sId) {
            debugger;
            var sControlType = this.getModel("Employee").getProperty("/ControlType");
            return sControlType === "Dialog" ? sap.ui.getCore().byId(sId) : this.byId(sId);
        },

        getModel: function (sName) {
            return sName === "" ? this.getOwnerComponent().getModel() : this.getOwnerComponent().getModel(sName);
        },

        setProperty: function (property, value) {
            return this.getModel("Company").setProperty(property, value);
        },

        getProperty: function (property) {
            return this.getModel("Company").getProperty(property);
        },

        getFilter: function (path, operator, value) {
            return new sap.ui.model.Filter({path: path, operator: operator, value1: value});
        },

        readData: function (sEntitySet, sProperty) {
            var oCompanyModel = this.getModel();
            oCompanyModel.read(sEntitySet, {
                success: function (oData) {
                    this.getModel("Company").setProperty(sProperty, oData.results);
                }.bind(this),
                error: function (oError) {
                    debugger;
                }
            });
        },

        readDataWithParameter: function (sEntitySet, sProperty, oFilters) {
            this.getModel().read(sEntitySet, {
                filters: [oFilters],
                urlParameters: {
                    // $expand: parameter
                },
                success: function (oData) {
                    debugger;

                    // if (oData.results[0].URL) {
                    //     if (oData.results[0].URL !== "") {
                    //         oData.results[0].URL = "/v2" + oData.results[0].URL;
                    //     }
                    // }
                    oData.results ? this.setProperty(sProperty, oData.results[0]) : this.setProperty(sProperty, oData);
                }.bind(this),
                error: function (oError) {}
            });
        }
    });
});
