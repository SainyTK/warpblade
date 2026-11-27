import base64
import contextlib
from pathlib import Path

from openai import OpenAI


def draw(prompt: str, refs: list[Path], size: str, model: str) -> bytes:
    client = OpenAI()
    common = {
        "model": model,
        "prompt": prompt,
        "size": size,
        "background": "transparent",
        "output_format": "png",
        "quality": "high",
        "n": 1,
    }
    if not refs:
        result = client.images.generate(**common)
    else:
        with contextlib.ExitStack() as stack:
            images = [stack.enter_context(path.open("rb")) for path in refs]
            result = client.images.edit(image=images, **common)
    data = result.data or []
    if not data or not data[0].b64_json:
        raise RuntimeError("The Images API returned no image")
    return base64.b64decode(data[0].b64_json)
