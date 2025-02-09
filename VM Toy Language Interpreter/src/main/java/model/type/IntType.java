package model.type;

import model.value.IValue;

public class IntType implements IType{
    @Override
    public boolean equals(IType type) {
        return type instanceof IntType;
    }

    public String toString() {
        return "int";
    }

    @Override
    public IValue getDefaultValue() {
        return null;
    }
}
