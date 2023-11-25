import { Archetype, Scheme } from "../Fanatic";
import { Log } from "../Sword/Log";
import { Action, VTCH } from "../Witch";
import { ApplicationModel } from "./Archetypes";
import { MainImprint, ApplicationActivityImprint } from "./Imprints";
import { DataLoader } from "./Loader";

/**
 * The application scheme is unique in that it encapsulates functionality within the application.
 * For most schemes there would be no cross-polination of functionality between routing, controllers and views.
 * Schemes are intended to modulate archetype instances on behalf of the application. In the case of the application
 * scheme, it is the controller for the application.
 **/

export class ApplicationScheme extends Scheme {
    public Root?: Archetype | undefined;
    public ForceReload = {
        StaticAssets: true,
        DatabaseSchema: true
    };

    private ApplicationViewClass?: typeof VTCH;
    private ApplicationImprintInstance?: MainImprint;

    /**
     * @discussion
     * The application scheme is esssentially a "controller" for the web application. It has methods that, while don't map to routes, are
     * called by route handlers to provide output back to the response.
     *
     * Each session that comes into the application could have its own instance of the application scheme; or there could be a single instance
     * of the application scheme that maintains global state for all users. This is the decision of the implementing developer.
     *
     * In the example application, our application scheme is a single instance; and there is a property on the application that maps an integer
     * to a user session. This is a very simple example of how to maintain state for our application.
    **/
    private StatMap: Map<string, number> = new Map<string, number>();


    constructor() {
        super();
        this.Initialize();
    }

    private async Initialize(): Promise<void> {
        await this.SetupApplicationModel();
        await this.SetupApplicationImprint();
    }

    private async SetupApplicationModel(): Promise<void> {
        // ostensibly fetch the application model from the database
        this.Root = new ApplicationModel();
    }

    // Sets up the view class for the application; and the model instance that will be used to render the view
    private async SetupApplicationImprint(): Promise<void> {
        this.ApplicationViewClass = VTCH.Factory(MainImprint, await DataLoader.LoadTemplate("main-layout.ejs"));


        // Force reload of static resources on each request
        let resetCSS = await DataLoader.LoadCSS("reset.css");
        let baseCSS = await DataLoader.LoadCSS("base.less");
        let exampleHTML = await DataLoader.LoadHTML("lorum-ipsum.html");

        this.ApplicationImprintInstance = new MainImprint();
        this.ApplicationImprintInstance.CSS = `${resetCSS}\n${baseCSS}`;
        this.ApplicationImprintInstance.HTML = ""; // exampleHTML





        // e.g. if (this.Root.CanOpenDocument) { 
        // e.g. this.ApplicationImprintInstance.BackgroundColor = this.Root.Colors.Background
        // and so forth
        let openDocument = new ApplicationActivityImprint();
        openDocument.Name = "Open Document";
        openDocument.Description = "Opens a document";
        openDocument.ActivityAction = new Action("Activity", "Open", "~");

        let newDocument = new ApplicationActivityImprint();
        newDocument.Name = "New Document";
        newDocument.Description = "Creates a new document";
        newDocument.ActivityAction = new Action("Activity", "New");

        let viewUsers = new ApplicationActivityImprint();
        viewUsers.Name = "View Users";
        viewUsers.Description = "Views a list of users";
        viewUsers.ActivityAction = new Action("Activity", "View", "Users");

        this.ApplicationImprintInstance.Items = [openDocument, newDocument, viewUsers];
    }

    public async Index(userId: string): Promise<string> {
        if (!(this.ApplicationImprintInstance)) {
            await this.Initialize();
        }

        if (!(this.ApplicationImprintInstance)) {
            throw new Error("Application Imprint is not initialized");
        }

        let view = new (this.ApplicationViewClass!)();

        // Force reload of static resources on each request
        if (this.ForceReload.StaticAssets) {
            let mainLayout = await DataLoader.LoadTemplate("main-layout.ejs");
            let resetCSS = await DataLoader.LoadCSS("reset.css");
            let baseCSS = await DataLoader.LoadCSS("base.less");
            // this.ApplicationViewClass= mainLayout
            this.ApplicationImprintInstance.CSS = `${resetCSS}\n${baseCSS}`;
            view.Template = mainLayout;
        }

        this.ApplicationImprintInstance.Counter = this.StatMap.has(userId) ? this.StatMap.get(userId)! : 0;
        this.ApplicationImprintInstance.Counter += 1;
        this.StatMap.set(userId, this.ApplicationImprintInstance.Counter);

        Log.info("Application", { userId, counter: this.ApplicationImprintInstance.Counter });

        return await view.Render(this.ApplicationImprintInstance!);
    }
}
