package model.value;

import model.type.IType;
import model.type.RefType;

public class RefValue implements IValue {
    private final int address;
    private final IType locationType;

    public RefValue(int address, IType locationType) {
        this.address = address;
        this.locationType = locationType;
    }

    public int getAddress() {
        return address;
    }

    public IType getLocationType() {
        return locationType;
    }

    @Override
    public IType getType() {
        return new RefType(locationType);
    }

    @Override
    public boolean equals(IValue value) {
        if (value instanceof RefValue) {
            return address == ((RefValue) value).getAddress() && locationType.equals(((RefValue) value).getLocationType());
        } else {
            return false;
        }
    }

    @Override
    public String toString() {
        return String.format("(%d, %s)", address, locationType);
    }
}