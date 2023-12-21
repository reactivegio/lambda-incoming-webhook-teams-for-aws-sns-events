
export function isCloudwatchAlarmNotification(x) {
	return x != null && x.AlarmName != null
}

export function getAlarmLink(alarmArn) {
	const arn = arnParser.parse(alarmArn)
	return `https://${arn.region}.console.aws.amazon.com/cloudwatch/home?region=${
		arn.region
	}#s=Alarms&alarm=${arn.resource.split(":")[1]}`
}

export function getHeadingLabel(state) {
	switch (state) {
		case "OK":
			return "Good"
		case "ALARM":
			return "Attention"
		case "INSUFFICIENT_DATA":
			return "Warning"
	}
}

export function getEmoji(state) {
	switch (state) {
		case "OK":
			return "✅"
		case "ALARM":
			return "🚨"
		case "INSUFFICIENT_DATA":
			return "⚠️"
	}
}
