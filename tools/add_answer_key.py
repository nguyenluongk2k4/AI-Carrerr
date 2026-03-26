import json
import os

BASE = r"C:\Git\AI_Career2\AI_Carreer\data"
FILES = [
    "dialy_clean.json",
    "hoahoc_clean.json",
    "tinhoc_clean.json",
    "history_clean.json",
    "biology_clean.json",
    "literature_clean.json",
    "general_knowledge_clean.json",
    "culture_arts_clean.json",
    "iq_clean.json",
]


def main() -> None:
    updated = []
    for name in FILES:
        path = os.path.join(BASE, name)
        if not os.path.exists(path):
            print("missing", name)
            continue
        with open(path, encoding="utf-8", errors="replace") as f:
            data = json.load(f)
        changed = False
        for q in data:
            if "answer_key" in q:
                continue
            options = []
            for key in ["a", "b", "c", "d", "e"]:
                opt = q.get(f"option_{key}")
                val = q.get(f"value_{key}")
                if opt is not None and val is not None:
                    options.append((key, val))
            if not options:
                continue
            max_val = max(v for _, v in options)
            for k, v in options:
                if v == max_val:
                    q["answer_key"] = k
                    break
            changed = True
        if changed:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            updated.append(name)
    print("updated", updated)


if __name__ == "__main__":
    main()
