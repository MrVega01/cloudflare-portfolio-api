// send email
export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)

		if (url.pathname === "/email" && request.method === "POST") {
			try {
				const { subject, content } = await request.json() || {} // BODY
				if (!subject || !content) return Response.json({ error: 'Bad request' }, { status: 400 })
				
				const bodyRequest = {
					personalizations: [
						{
							to: [
								{
									"email": "ignaciovega200301@gmail.com"
								}
							]
						}
					],
					from: {
						email: "ignaciovega200301@gmail.com"
					},
					subject,
					content: [
						{
							type: "text/html",
							value: content
						}
					]
				}
				
				const { API_KEY_SENDGRID } = env
				return fetch('https://api.sendgrid.com/v3/mail/send', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${API_KEY_SENDGRID}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(bodyRequest)
				}).then(async (response) => {
						return new Response(null, { status: 200 })
					})
			} catch (error) {
				console.error(error)
				return Response.json({ error: 'Server error' }, { status: 502 })
			}
		}
		return new Response('Not found', { status: 404 })
	}
}
