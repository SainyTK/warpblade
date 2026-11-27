import json
from dataclasses import dataclass
from pathlib import Path

EVOLVED = "_evo"


@dataclass(frozen=True)
class Icon:
    id: str
    set: str
    element: str
    name: str
    text: str

    @property
    def evolved(self) -> bool:
        return self.id.endswith(EVOLVED)

    @property
    def base(self) -> str:
        return self.id.removesuffix(EVOLVED)


def load_icons(path: Path) -> list[Icon]:
    return [Icon(**row) for row in json.loads(path.read_text())]
