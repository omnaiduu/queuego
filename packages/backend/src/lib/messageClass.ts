




export class WhatsApp {
    private to: string;
    private WHATSAPP_BUSINESS_PHONE_NUMBER_ID: string;
    private token: string;

    constructor(
        to: string,
        WHATSAPP_BUSINESS_PHONE_NUMBER_ID: string,
        token: string
    ) {
        this.to = to;
        this.WHATSAPP_BUSINESS_PHONE_NUMBER_ID = WHATSAPP_BUSINESS_PHONE_NUMBER_ID;
        this.token = token;
    }
    async sendRequest(type: string, payload: any) {
        try {
            const response = await fetch(
                `https://graph.facebook.com/v22.0/${this.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: this.to,
                        type: type,
                        [type]: payload,
                    }),
                }
            );
            if (!response.ok) {
                console.log("PAyload", payload);
                console.log("Error:", await response.json());
            }

            return response;
        } catch (e) {
            console.log("Fetch Error: ", e);
        }
    }


    async sendTextMessage(text: string) {
        return await this.sendRequest("text", { body: text });
    }

    async sendTemplateMessage(templateName: string, languageCode: string = "en_US") {
        await this.sendRequest("template", {
            name: templateName,
            language: { code: languageCode }
        });
    }

}