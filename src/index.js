// send email
export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)

		const headers = new Headers();
		headers.set("Access-Control-Allow-Origin", "*")
		headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS")
		headers.set("Access-Control-Allow-Headers", request.headers.get("Access-Control-Request-Headers"))
		headers.set("Access-Control-Max-Age", "86400")

    if (request.method === 'OPTIONS') {
			if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
      ) {
        // Handle CORS preflight requests.
        return new Response(null, { headers })
      } else {
        // Handle standard OPTIONS request.
        return new Response(null, {
          headers: {
            Allow: "GET, HEAD, POST, OPTIONS",
          },
        });
      }
    }
    else {
			const auth = request.headers.get('Authorization')
			if(auth){
				if(auth !== env.API_KEY) return new Response(null, { status: 403, headers })
			} else return new Response(null, { status: 401, headers })
		}

		if (url.pathname === "/email" && request.method === "POST") {
			try {
				const body = await request.json() || {} // BODY
				const { subject, content } = body
				if (!subject || !content) return Response.json({ error: 'Bad request' }, { status: 400, headers })
				
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
				}).then(async () => {
						return new Response(null, { status: 200, headers })
					})
			} catch (error) {
				console.error({error, body})
				return Response.json({ error: 'Server error' }, { status: 500, headers })
			}
		}
		return new Response('Not found', { status: 404, headers })
	}
}
