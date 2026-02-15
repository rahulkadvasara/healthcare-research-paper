from tools.llm_client import call_llm
from utils.logger import log_event

class DrugAgent:

    def run(self, new_medicine, context):

        existing_meds = context.get("medicines", [])

        all_meds = existing_meds + [new_medicine]

        log_event(f"DrugAgent checking interactions for: {all_meds}")

        messages = [
            {
                "role": "system",
                "content": (
                    "You are a clinical drug interaction analysis assistant.\n"
                    "Analyze potential interactions among the listed medications.\n\n"
                    "Provide structured output:\n"
                    "1. Interaction Risk Level (Low/Moderate/High)\n"
                    "2. Explanation\n"
                    "3. Recommended Action\n\n"
                    "If no significant interaction, clearly state that."
                )
            },
            {
                "role": "user",
                "content": f"Medications: {all_meds}"
            }
        ]

        response = call_llm(messages)

        return response
