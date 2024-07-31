sap.ui.define([
    "sap/ui/model/json/JSONModel", "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return { /**
         * Provides runtime info for the device the UI5 app is running on as JSONModel
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        _createNewEmployee: function () {
            return {
                "EMP_NAME": "",
                "EMP_NUMBER": "",
                "EMP_COUNTRY": "",
                "EMP_CTC": "",
                "EMP_EXPERIENCE": "",
                "EMP_AGE": "",
                "EMP_MODULE_MODULE_ID": "",
                "MEDIA_TYPE": "",
                "FILE_NAME": "",
                "CONTENT": ""
            }

        },
    };
});
