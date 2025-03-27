import chromadb

from src.core.config import config


class ChromaDBClient:
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            cls._client = chromadb.HttpClient(host=config.CHROMA_HOST, port=config.CHROMA_PORT)
        return cls._client
