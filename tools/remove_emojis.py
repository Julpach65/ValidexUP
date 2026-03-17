import os
import re

def remove_emojis(text):
    # Regex for matching emojis
    emoji_pattern = re.compile(
        "["
        u"\U0001f300-\U0001f5ff"
        u"\U0001f900-\U0001f9ff"
        u"\U0001f600-\U0001f64f"
        u"\U0001f680-\U0001f6ff"
        u"\u2600-\u26ff"
        u"\u2700-\u27bf"
        "]+",
        flags=re.UNICODE
    )
    return emoji_pattern.sub(r'', text)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.next' in root:
            continue
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = remove_emojis(content)
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Limpiado: {filepath}")

if __name__ == "__main__":
    process_directory(r"c:\\Users\\julpa\\OneDrive\\Desktop\\VALIDEX\\validex_ui\\src")
