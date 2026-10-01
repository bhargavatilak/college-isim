import os
import re

files_to_update = [
    "src/main/java/com/example/demo/model/Course.java",
    "src/main/java/com/example/demo/model/Department.java",
    "src/main/java/com/example/demo/entity/Document.java",
    "src/main/java/com/example/demo/entity/IdCard.java",
    "src/main/java/com/example/demo/dto/PromoteStudentRequest.java",
    "src/main/java/com/example/demo/entity/StudentMovement.java",
    "src/main/java/com/example/demo/dto/StudentDto.java",
    "src/main/java/com/example/demo/model/Student.java",
    "src/main/java/com/example/demo/model/AcademicRecord.java"
]

def capitalize(s):
    return s[0].upper() + s[1:] if s else s

for filepath in files_to_update:
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Simple regex to find fields: private Type name;
    fields = re.findall(r'private\s+([\w<>\[\]]+)\s+(\w+)(?:\s*=\s*[^;]+)?\s*;', content)
    
    getters_setters = "\n"
    for type_name, var_name in fields:
        # getter
        prefix = "is" if type_name.lower() == "boolean" else "get"
        getters_setters += f"    public {type_name} {prefix}{capitalize(var_name)}() {{\n        return {var_name};\n    }}\n\n"
        
        # setter
        # check if setting active using Boolean payload causes issue?
        if type_name == "boolean" and var_name == "active":
            # Add a Boolean version just in case
            getters_setters += f"    public void set{capitalize(var_name)}(Boolean {var_name}) {{\n        if ({var_name} != null) this.{var_name} = {var_name};\n    }}\n\n"
        
        getters_setters += f"    public void set{capitalize(var_name)}({type_name} {var_name}) {{\n        this.{var_name} = {var_name};\n    }}\n\n"
        
    # Insert before last closing brace
    idx = content.rfind('}')
    if idx != -1:
        new_content = content[:idx] + getters_setters + content[idx:]
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"Could not find closing brace in {filepath}")
