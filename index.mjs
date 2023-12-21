import * as arnParser from "@aws-sdk/util-arn-parser"
import { formatISO, parseJSON } from "date-fns"
import * as log from "lambda-log"
import { IncomingWebhook } from "ms-teams-webhook"
import { getAlarmLink, getEmoji, getHeadingColor, isCloudwatchAlarmNotification } from "./utils.mjs"

export const handler = async (event) => {
  // retrieve it from incoming webhook apps on teams
	const webhookUrl = process.env.TEAMS_WEBHOOK_URL
	if (webhookUrl == undefined) {
		throw new Error("TEAMS_WEBHOOK_URL must be defined")
	}

	const webhook = new IncomingWebhook(webhookUrl)

	for (const record of event.Records) {
		const message = JSON.parse(record.Sns.Message)
		if (!isCloudwatchAlarmNotification(message)) {
			log.warn("Ignoring non-alarm message", message)
			continue
		}

		const stateChangeTime = parseJSON(message.StateChangeTime)

		await webhook.send({
			type: "message",
			attachments: [
				{
					contentType: "application/vnd.microsoft.card.adaptive",
					contentUrl: null,
					content: {
						$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
						type: "AdaptiveCard",
						version: "1.3",
						body: [
							{
								type: "Container",
								padding: "None",
								items: [
									{
										type: "TextBlock",
										wrap: true,
										size: "Large",
										color: getHeadingColor(message.NewStateValue),
										text: `${getEmoji(message.NewStateValue)} ${
											message.NewStateValue
										}: ${message.AlarmName}`,
									},
								],
							},
							{
								type: "Container",
								items: [
									{
										type: "TextBlock",
										text: message.AlarmDescription,
										wrap: true,
									},
									{
										type: "TextBlock",
										text: message.NewStateReason,
										wrap: true,
									},
								],
								isVisible: false,
								id: "alarm-details",
							},
							{
								type: "Container",
								padding: "None",
								items: [
									{
										type: "ColumnSet",
										columns: [
											{
												type: "Column",
												width: "stretch",
												items: [
													{
														type: "TextBlock",
														text: "Account",
														wrap: true,
														isSubtle: true,
														weight: "Bolder",
													},
													{
														type: "TextBlock",
														wrap: true,
														spacing: "Small",
														text: message.AWSAccountId,
													},
												],
											},
											{
												type: "Column",
												width: "stretch",
												items: [
													{
														type: "TextBlock",
														text: "Region",
														wrap: true,
														isSubtle: true,
														weight: "Bolder",
													},
													{
														type: "TextBlock",
														text: message.Region,
														wrap: true,
														spacing: "Small",
													},
												],
											},
											{
												type: "Column",
												width: "stretch",
												items: [
													{
														type: "TextBlock",
														text: "Date",
														wrap: true,
														weight: "Bolder",
														isSubtle: true,
													},
													{
														type: "TextBlock",
														text: `{{DATE(${formatISO(stateChangeTime)})}}`,
														wrap: true,
														spacing: "Small",
													},
												],
											},
											{
												type: "Column",
												width: "stretch",
												items: [
													{
														type: "TextBlock",
														text: "Time",
														wrap: true,
														weight: "Bolder",
														isSubtle: true,
													},
													{
														type: "TextBlock",
														text: `{{TIME(${formatISO(stateChangeTime)})}}`,
														wrap: true,
														spacing: "Small",
													},
												],
											},
										],
									},
								],
							},
						],
						padding: "None",
						actions: [
							{
								type: "Action.ToggleVisibility",
								title: "Toggle Details",
								targetElements: ["alarm-details"],
							},
							{
								type: "Action.OpenUrl",
								title: "View in CloudWatch",
								url: getAlarmLink(message.AlarmArn),
							},
						],
					},
				},
			],
		})
	}
}


