sap.ui.define([
    "./App.controller", "../model/models", "sap/m/MessageBox"
], function (BaseController, Models, MessageBox) {
    "use strict";

    return BaseController.extend("zcompanymgmt.controller.View1", {
        onInit: function () {
            this.getModel().setUseBatch(false);
            this.getView().byId("projectTable").setVisible(false);
            this.readData("/MODULE", "/ModuleItems");
        },

        onUpdateFinished: function (oEvent) {
            var iTableCount = oEvent.getSource().getMaxItemsCount();
            this.setProperty("/iCount", iTableCount);
        },

        onModuleChange: function (oEvent) {
            var oSelectedItem = oEvent.mParameters.selectedItem;
            var oSelectedModule = oSelectedItem.getBindingContext("Company").getObject();
            this.getModel("Company").setProperty("/SelectedModule", [oSelectedModule,]);
            var oModuleFilter = this.getFilter("EMP_MODULE_MODULE_ID", sap.ui.model.FilterOperator.EQ, oSelectedModule.MODULE_ID);
            this.getModel().read("/EMPLOYEE", {
                filters: [oModuleFilter],
                success: function (oData) {
                    this.getModel("Company").setProperty("/Employee", oData.results);
                    this.getView().byId("projectTable").setVisible(true);
                    sap.m.MessageToast.show("Employee data loaded sucessfully");
                }.bind(this),
                error: function (oError) {}
            });
        },

        onSelectionChange: function (oEvent) {
            debugger;
            var aFilters = [];
            var oSelectedEmployee = oEvent.mParameters.listItem.getBindingContext("Company").getObject();
            var oEmployeeFilter = this.getFilter("EMP_ID", sap.ui.model.FilterOperator.EQ, oSelectedEmployee.EMP_ID);
            aFilters.push(oEmployeeFilter);
            this.readDataWithParameter("/EMPLOYEE", "/SelectedEmployee", aFilters);

            // this.getModel().read("/EMPLOYEE", {
            // filters: [oEmployeeFilter],
            // success: function (oData) {
            //     debugger;
            //     if (oData.results[0].EMP_CV) {
            //       if (oData.results[0].EMP_CV.URL !== "") {
            //         oData.results[0].EMP_CV.URL = "/v2" + oData.results[0].EMP_CV.URL;
            //       }
            //     }oData.results ? this.setProperty(sProperty, oData.results[0]) : this.setProperty(sProperty, oData);
            // }.bind(this),
            // error: function (oError) {},
            // });

            var iEmployeeId = oSelectedEmployee.EMP_ID;
            this.getRouter().navTo("DisplayEmployee", {EmployeeId: iEmployeeId});
        },

        onCreate: function () {
            var oEmployeePayload = Models._createNewEmployee();
            this.setProperty("/createEmployee", oEmployeePayload);
            if (!this.Dialog) {
                this.Dialog = sap.ui.xmlfragment("zcompanymgmt.fragments.create", this);
                this.getView().addDependent(this.Dialog);
                this.Dialog.open();
            }
            // else {
            // // sap.ui.getCore().byId("INP_NAME").setValue("");
            // // sap.ui.getCore().byId("INP_NUMBER").setValue("");
            // // sap.ui.getCore().byId("INP_COUNTRY").setValue("");
            // // sap.ui.getCore().byId("INP_CTC").setValue("");
            // // sap.ui.getCore().byId("INP_EXP").setValue("");
            // // sap.ui.getCore().byId("INP_AGE").setValue("");
            // // sap.ui.getCore().byId("INP_MODULE").setValue("");
            // }
            this.Dialog.open();
        },

        onCancelDialog: function () {
            this.Dialog.close();
            if (this.Dialog) {
                this.Dialog.destroy();
                this.Dialog = null;
            }
        },

        onAddNewEmp: function (oEvent) {
            debugger;
            this.getModel("Company").setProperty("/ControlType", "Dialog");
            var sModuleKey = sap.ui.getCore().byId("INP_MODULE").getSelectedKey();
            var oEmployeePayload = this.getProperty("/createEmployee");
            if(aFileItems.length === 0){
                sap.m.MessageToast.show("Please Upload Your CV");
                return;
            }
            oEmployeePayload.EMP_MODULE_MODULE_ID = sModuleKey;
            oEmployeePayload.MEDIA_TYPE = this.sMediaType;
            oEmployeePayload.FILE_NAME = this.oFile.name;
            oEmployeePayload.CONTENT = this.fileContent;
            var aFileItems = sap.ui.getCore().byId("UploadSet").getItems();

            var oNewEmp = this.getModel();
            oNewEmp.create("/EMPLOYEE", oEmployeePayload, {
                success: function (oData) {
                    debugger;
                    var oEmployeeModel = this.getModel("Company");
                    var aEmployeeItems = oEmployeeModel.getProperty("/Employee");
                    aEmployeeItems.push(oData);
                    oEmployeeModel.refresh(true);
                    this.onCancelDialog();
                    MessageBox.success(`Employee ${
                        oData.EMP_NAME
                    } created successfully`);
                }.bind(this),
                error: function (error) {
                    var oErrorObj = JSON.parse(error.responseText);
                    var sErrorMsg = oErrorObj.error.message.value;
                    sErrorMsg === "Entity already exists" ? MessageBox.warning("Employee already exists") : MessageBox.warning(sErrorMsg);
                }
            });
        },

        // handleUploadPress: function (oEvent) {
        // debugger;
        // var oFileUploader = sap.ui.getCore().byId("fileUploader");
        // oFileUploader.upload();
        // },

        onBeforeUploadStarts: function (oEvent) {
            debugger;
            var that = this;
            this.oFile = oEvent.mParameters.item.getFileObject();
            this.oItem = oEvent.getParameter("item");
            this.sMediaType = this.oItem.getMediaType();

            var reader = new FileReader();
            reader.onload = (e) => {
                that.fileContent = e.target.result.split(",")[1];
                const fileName = this.oFile.name;


                // this.oEmployeePayload = this.getProperty("/createEmployee");


                // var oFileObj = {
                //     MEDIA_TYPE: sMediaType,
                //     FILE_NAME: fileName,
                //     CONTENT: fileContent
                // };
                // this.getModel().create("/EMPLOYEE", oEmployeePayload, {
                //     success: function (oData) {
                //         debugger;
                //         sap.m.MessageToast.show("File Added Successfully!!!");
                //     }.bind(this),
                //     error: function (oError) {
                //         debugger;
                //     }
                // });
            };
            reader.readAsDataURL(this.oFile);
        },

        onUploadComplete: function (oEvent) {
            var oUploadSet = sap.ui.getCore().byId("UploadSet");
            var oResponse = oEvent.getParameter("response");

            if (oResponse.status === 201) { // Success handling
                sap.m.MessageToast.show("Upload successful!");
            } else { // Error handling
                sap.m.MessageToast.show("Upload failed!");
            }
        },

        onUploadAborted: function (oEvent) {
            sap.m.MessageToast.show("Upload aborted!");
        },

        onUploadTerminated: function (oEvent) {
            sap.m.MessageToast.show("Upload terminated!");
        }
    });
});
