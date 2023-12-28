# lambda-incoming-webhook-teams-for-aws-sns-events
A lambda in nodeJs to admit aws services to notify you about activities that you want to track on your teams channel

### Create the webhook on Microsoft teams
1. create a group/channel to manage notifications
2. click key "+" in app and search incoming webhook
3. configure following the instructions and save the webhook url you will need to hook later in lambda environment variables

### Create a lambda with an associated sns event 
Create a lambda with index.mjs and message-inputs.mjs files present in this project and hook an sns event to trigger the lambda

### Create layers -> left menu Layers
Layers are used to load dependencies
1. Locally create nodejs folder and go install packages with npm or yarn
2. zipper folder with `zip -r layer-package.zipper nodejs`
3. create a new layer and upload the zipper (be careful not to exceed mb otherwise it has to be uploaded to s3)
4. retrieve the arn of the newly created layer and hook layer by inserting the arn

### Hook layer
Go to your lambda in code scroll down, hook layer created by inserting the previously copied arn

### Lambda environment variables configuration:
In tab Configurations -> environment variables create the TEAMS_WEBHOOK_URL with the url created in webhook teams

### Deploy
Click deploy button to make the lambda executable

### Create an alarm using same sns hooked to lambda
By simply engaging the sns also configured to trigger the lambda.
