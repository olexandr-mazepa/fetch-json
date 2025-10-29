interface Env {}
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(FormData);
export default {
	async fetch(request, env, ctx): Promise<Response> {

		const mailgunClient = mailgun.client({
			"username": "api",
			"key": env.SECRET_KEY || "",
			"url": env.URL || "",
			useFetch: true,
		});
		const messageData =  {
			from: 'postmaster@mailgun.zeefarmer.com',
			to: ['zepa1993@gmail.com'],
			subject: 'Hello from cloudflare workers',
			text: 'Testing some Mailgun awesomness!',
			html: '<a href="https://google.com">Test</a>',
			attachments: [
				{
					filename: 'test_buffer.txt',
					data: Buffer.from('Hello World from Mailgun.js')
				}
			]
		};
		let res;
		try {
			res = await mailgunClient.messages.create(env.DOMAIN || "", messageData);
		} catch (error) {
			console.error("Error sending email:", error);
		}

		const options = { headers: { "content-type": "application/json" } };
		return new Response(res ? JSON.stringify(res) : "Error sending email", options);
	},
} satisfies ExportedHandler<Env>;
