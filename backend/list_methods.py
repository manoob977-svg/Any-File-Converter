import cloudmersive_convert_api_client
import inspect

api_instance = cloudmersive_convert_api_client.ConvertDocumentApi()
methods = [m for m in dir(api_instance) if not m.startswith('_')]
print("\n".join(methods))
