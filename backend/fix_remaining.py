import os
import re

files_to_update = [
    "src/main/java/com/example/demo/entity/AdmissionApplication.java",
    "src/main/java/com/example/demo/dto/CertificateRequestDto.java",
    "src/main/java/com/example/demo/entity/CertificateRequest.java",
    "src/main/java/com/example/demo/dto/StatusUpdateRequest.java",
    "src/main/java/com/example/demo/dto/VerifyRequest.java",
    "src/main/java/com/example/demo/dto/AttendanceOverviewDTO.java",
    "src/main/java/com/example/demo/dto/ExamOverviewDTO.java",
    "src/main/java/com/example/demo/dto/FinanceOverviewDTO.java",
    "src/main/java/com/example/demo/dto/LibraryOverviewDTO.java",
    "src/main/java/com/example/demo/dto/AdmissionOverviewDTO.java",
    "src/main/java/com/example/demo/dto/RegistrarDashboardStats.java",
]

def capitalize(s):
    return s[0].upper() + s[1:] if s else s

for filepath in files_to_update:
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Generate constructors if it's a DTO
    if "DTO" in filepath or "Stats" in filepath:
        fields = re.findall(r'private\s+([\w<>\[\]]+)\s+(\w+)(?:\s*=\s*[^;]+)?\s*;', content)
        class_name = os.path.basename(filepath).replace(".java", "")
        if fields and f"public {class_name}(" not in content:
            args = ", ".join([f"{t} {n}" for t, n in fields])
            assigns = "\n".join([f"        this.{n} = {n};" for t, n in fields])
            constructor = f"\n    public {class_name}({args}) {{\n{assigns}\n    }}\n"
            
            # also add no-args
            constructor += f"\n    public {class_name}() {{}}\n"
            
            idx = content.rfind('}')
            if idx != -1:
                content = content[:idx] + constructor + content[idx:]

    fields = re.findall(r'private\s+([\w<>\[\]]+)\s+(\w+)(?:\s*=\s*[^;]+)?\s*;', content)
    
    getters_setters = "\n"
    for type_name, var_name in fields:
        prefix = "is" if type_name.lower() == "boolean" else "get"
        if f" {prefix}{capitalize(var_name)}(" not in content:
            getters_setters += f"    public {type_name} {prefix}{capitalize(var_name)}() {{\n        return {var_name};\n    }}\n\n"
        if f" set{capitalize(var_name)}(" not in content:
            getters_setters += f"    public void set{capitalize(var_name)}({type_name} {var_name}) {{\n        this.{var_name} = {var_name};\n    }}\n\n"
            if type_name == "boolean" and var_name == "active":
                getters_setters += f"    public void set{capitalize(var_name)}(Boolean {var_name}) {{\n        if ({var_name} != null) this.{var_name} = {var_name};\n    }}\n\n"

    idx = content.rfind('}')
    if idx != -1 and getters_setters.strip():
        new_content = content[:idx] + getters_setters + content[idx:]
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

# Fix StudentDocument.java enums
sd_path = "src/main/java/com/example/demo/entity/StudentDocument.java"
if os.path.exists(sd_path):
    with open(sd_path, 'r') as f:
        sd_content = f.read()
    sd_content = sd_content.replace("public enum UploadStatus", "enum UploadStatus")
    sd_content = sd_content.replace("public enum VerificationStatus", "enum VerificationStatus")
    with open(sd_path, 'w') as f:
        f.write(sd_content)
    print(f"Updated {sd_path}")
