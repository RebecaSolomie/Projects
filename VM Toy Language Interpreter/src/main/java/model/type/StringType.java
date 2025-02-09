package model.type;
import model.value.IValue;
import model.value.StringValue;

public class StringType implements IType {
    @Override
    public boolean equals(IType type) {
        return type instanceof StringType;
    }

    public String toString() {
        return "string";
    }

    public IValue getDefaultValue() {
        return new StringValue("");
    }
}
