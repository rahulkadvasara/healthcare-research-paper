from tools.report_image_processor import extract_text_from_image
from tools.llm_client import call_llm

class ReportAgent:

    def run(self, image_path):
        text = extract_text_from_image(image_path)

        messages = [
            {
                "role": "system",
                "content": (
                    "You are a patient-friendly medical report explainer.\n"
                    "Respond in plain paragraph format only.\n"
                    "No headings.\n"
                    "No markdown.\n"
                    "No bullet points.\n"
                    "No lab reference ranges.\n"
                    "No percentages unless important.\n"
                    "Use simple everyday language.\n"
                    "Keep it under 120 words.\n"
                )
            },
            {
                "role": "user",
                "content": f"Explain this report simply:\n{text}"
            }
        ]



        return call_llm(messages)
