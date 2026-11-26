import argparse
import base64
import contextlib
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]
HEROES = ROOT / "src/generatedHeroArt/assets"
RAW = Path(__file__).resolve().parent / "raw"
MODEL = "gpt-image-2.5-sunburst"

LOOK = (
    "The Lampwarden, an original character for a dark-fantasy action game: an elderly woman who was once a warp knight "
    "and now keeps the last lights of an old city fallen to night. Silver-white hair in one long thick braid over her "
    "left shoulder, calm lined face, kind amber-gold eyes, small crescent scar on her cheek. Deep hooded mantle of "
    "midnight teal with a ragged hem over a long robe of ash grey and faded indigo, tarnished brass trim, a brown "
    "leather sash with two hanging paper charms. A broken crystal sword hilt with a short jagged pale-blue crystal stub "
    "hangs at her hip in a brass ring. She holds a tall dark iron staff topped with a hook, and from the hook hangs a "
    "brass cage lantern holding a small floating rift crystal that glows violet and cyan."
)

STYLE = (
    "Japanese JRPG character art matching the reference portraits: clean bold dark outlines, hard-edged two-tone cel "
    "shading, large expressive anime eyes, crisp flat colours, no painterly texture. Fully transparent background with "
    "no aura, no glow haze, no ground, no cast shadow, no text, no frame."
)

CHIBI = (
    "Draw her as an in-game sprite with the same super-deformed proportions as the attached small pixel hero sprite: "
    "the head with hood is about two fifths of her total height, short body, small feet, thick dark outline so the "
    "silhouette reads when shrunk to 80 pixels tall. Keep shapes simple and bold, fewer small details."
)

STEPS = {
    "body": (
        f"{LOOK} Use the attached full body design sheet for her exact outfit and colours. {CHIBI} Full body, standing "
        "calmly in a relaxed idle pose, three-quarter view facing to the right of the image, both feet fully visible at "
        "the bottom, the staff held upright in her right hand (the hand nearer the left of the image) with its foot on "
        "the ground beside her, the lantern hanging still from the hook just above her head, left hand resting on the "
        f"sword hilt at her hip. The whole figure and staff fit inside the image with wide margin on every side. {STYLE}"
    ),
    "talk": (
        f"{LOOK} The first attached image is this exact character as an in-game sprite. Redraw her identical: same "
        "outfit, colours, proportions, outline weight and size in the frame, same three-quarter view facing right, same "
        "feet position, staff held the same way and planted in the same place, lantern on the hook. Change only her "
        "pose and face: she turns her head a little toward the viewer with a warm small smile, and raises her free hand "
        "to chest height, palm open and turned up in a welcoming gesture, with three tiny cyan sparks above the palm. "
        f"The whole figure and staff fit inside the image with wide margin on every side. {STYLE}"
    ),
    "portrait": (
        f"{LOOK} The first attached image is her full body design. Head and shoulders portrait with normal adult "
        "proportions, framed and cropped exactly like the attached hero portraits, three-quarter view facing right, "
        "warm knowing small smile, the hood up behind her braid, the top of the lantern glowing violet at the edge of "
        f"the frame. {STYLE}"
    ),
}

SIZES = {"body": "1024x1536", "talk": "1024x1536", "portrait": "1024x1024"}


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate mentor art with the OpenAI Images API")
    parser.add_argument("step", choices=sorted(STEPS))
    parser.add_argument("--env", type=Path, required=True, help="dotenv file holding OPENAI_API_KEY")
    parser.add_argument("--ref", type=Path, action="append", default=[], help="reference image, in order")
    parser.add_argument("--hero", action="append", default=[], help="hero whose portrait is a style reference")
    parser.add_argument("--count", type=int, default=1)
    parser.add_argument("--model", default=MODEL)
    args = parser.parse_args()
    load_dotenv(args.env)
    RAW.mkdir(exist_ok=True)
    paths = [*args.ref, *(HEROES / hero / "portrait.webp" for hero in args.hero)]
    with contextlib.ExitStack() as stack:
        images = [stack.enter_context(path.open("rb")) for path in paths]
        result = OpenAI().images.edit(
            model=args.model,
            image=images,
            prompt=STEPS[args.step],
            size=SIZES[args.step],
            background="transparent",
            output_format="png",
            quality="high",
            n=args.count,
        )
    taken = len(list(RAW.glob(f"{args.step}-*.png")))
    for i, item in enumerate(result.data or []):
        out = RAW / f"{args.step}-{taken + i + 1}.png"
        out.write_bytes(base64.b64decode(item.b64_json or ""))
        print(out)


if __name__ == "__main__":
    main()
