import argparse
import subprocess
from pathlib import Path

from dotenv import load_dotenv

from check import off_element
from constants import ENV, HERE, MANIFEST, MODEL, ROOT, SPRITES
from contact import contact_sheet, sprite_sheet
from cut import recut
from generate import generate, make_sprite_sheet, missing
from models import load_icons
from pack import pack, pack_sprites
from prompts import sheet_prompt


def refresh_manifest() -> None:
    subprocess.run(["node", str(HERE / "manifest.mjs")], cwd=ROOT, check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate, cut and pack the skill icon atlas and the pickup sprites")
    parser.add_argument(
        "command",
        choices=["update", "manifest", "generate", "sprites", "prompt", "recut", "pack", "contact", "check"],
    )
    parser.add_argument("--env", type=Path, default=ENV, help="dotenv file holding OPENAI_API_KEY")
    parser.add_argument("--set", action="append", default=[], help="only icons of this set (a hero, arts, elements)")
    parser.add_argument("--ids", nargs="*", default=[], help="only these icon ids")
    parser.add_argument("--all", action="store_true", help="generate icons that already have art too")
    parser.add_argument("--model", default=MODEL)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--out", type=Path, help="contact sheet folder")
    args = parser.parse_args()

    if args.command in ("update", "manifest"):
        refresh_manifest()
    icons = load_icons(MANIFEST)
    every = {icon.id: icon for icon in icons}
    chosen = [i for i in icons if (not args.set or i.set in args.set) and (not args.ids or i.id in args.ids)]
    if args.command in ("update", "generate"):
        load_dotenv(args.env)
        todo = chosen if args.all or args.ids else missing(chosen)
        generate(todo, every, args.model, args.workers)
    if args.command == "prompt":
        print(sheet_prompt(chosen, every, 4, -(-len(chosen) // 4), False))
    if args.command == "check":
        off_element(chosen)
    if args.command == "recut":
        recut()
    if args.command == "sprites":
        load_dotenv(args.env)
        print(make_sprite_sheet(args.ids or list(SPRITES), args.model))
    if args.command in ("update", "sprites", "pack"):
        pack(icons)
        pack_sprites()
    if args.command == "contact":
        contact_sheet(chosen, args.out)
        sprite_sheet(args.out)


if __name__ == "__main__":
    main()
