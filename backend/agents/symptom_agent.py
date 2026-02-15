from tools.llm_client import call_llm

class SymptomAgent:

    def run(self, user_input, context):

        medicines = context.get("medicines", [])
        history = context.get("history", [])

        messages = [
            {
                "role": "system",
                "content": (
                    "You are a clinical decision-support assistant. "
                    "Provide:\n"
                    "1. Possible causes\n"
                    "2. Urgency level (Low/Moderate/High)\n"
                    "3. Recommended next steps\n"
                    "Use concise medical reasoning."
                )
            }
        ]

        if medicines:
            messages.append({
                "role": "system",
                "content": (
                    f"The patient is currently taking: {medicines}. "
                    "Consider potential interactions but do NOT repeat the medication list in the final answer."
                )
            })


        messages.extend(history)
        messages.append({"role": "user", "content": user_input})

        return call_llm(messages)
