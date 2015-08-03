## Slack Reminder

One of my team recently lamented that there's no way to mark something for followup in Slack. Once you've accessed the channel it's unread indicator is gone, never to return.

This is a quick hackup to solve that problem. The service scans the Slack API for all Reactions every 10 minutes. If it finds a reaction with the :remindme: emoji, it emails the user that placed it with the content of the message and a permalink to it.
