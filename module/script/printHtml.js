export default class PrintSheetHtml extends FormApplication {
    constructor(object = {}, options = {}) {
        super(object, options);
        this._data = object;
    }
        
    get title() {
        return "PrintSheet";
    }
    
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.resizable = true;
        options.title = "Export";
        return options;
    }

    
    static async convertdataToHtmlText(dataExport, template) {
        let defaultOptions = {...this.defaultOptions, template}
        let exportFrom = new PrintSheetHtml(dataExport, defaultOptions);
        let htmlForm = await exportFrom._renderInner(dataExport, defaultOptions);
        let result = PrintSheetHtml.generationPrefixSourceHtml();
        
        for(var i = 0 ; i < htmlForm.length ; i++) {
			if (htmlForm[i].outerHTML != undefined) {result += "\t\t" + htmlForm[i].outerHTML + "\n"}
        }
        
        result += "\t</body>\n";
        result += "</html>";
        return result;
    }
    
    static generationPrefixSourceHtml(){
        let  outText = "<html>\n";
        outText += "\t<head>\n";
        outText += "\t\t<meta content=\"text/html; charset=utf-8\">\n";
        outText += "\t</head>\n";
        outText += "\t<body>\n";
        
        return outText;
    }
}