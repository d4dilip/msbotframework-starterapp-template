var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================


// Create chat bot
var connector = new builder.ConsoleConnector().listen();
// var connector = new builder.ChatConnector({
//     appId: process.env.MICROSOFT_APP_ID,
//     appPassword: process.env.MICROSOFT_APP_PASSWORD
// });
var bot = new builder.UniversalBot(connector);



// Setup Restify Server
// var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function () {
//    console.log('%s listening to %s', server.name, server.url); 
// });
// server.post('/api/messages', connector.listen());

//=========================================================
// Bots Middleware
//=========================================================
bot.use(builder.Middleware.firstRun({ version: 1.0, dialogId: '*:/firstRun' }));


//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('Help', '/Help', { matches: /^help/i });
bot.beginDialogAction('menu', '/menu', { matches: /^menu/i });



bot.dialog('/', new builder.IntentDialog()
    .matches(/^hello/i, '/hello')
    .matches(/^hi/i, '/hello')
    .matches(/^hey/i, '/hello')
    .matches(/^version/i, '/BotVersion')
    .onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."))
);

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/hello', function (session) {
    session.send("Hello World");
});
///firstRun
bot.dialog('/firstRun', [
    function (session) {
        session.endDialog("Hello From a bot!! \n*I am sure you gonna like it :)")}
]);

bot.dialog('/Help', [
    function (session) {
        session.endDialog("Add commands and make me smart.");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What would you like me to do for you?", "BotVersion|Help|(quit)");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)' && results.response.entity != 'undefined') {
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog("ok!!");
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });

bot.dialog("/BotVersion", function (session) {
    session.endDialog('Bot version 1.0');
});
