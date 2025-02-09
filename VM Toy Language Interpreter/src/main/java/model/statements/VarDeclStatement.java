package model.statements;

import exceptions.StatementException;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.state.PrgState;
import model.type.IType;

public class VarDeclStatement implements IStatement{
    private final String name;
    private final IType type;

    public VarDeclStatement(String name, IType type){
        this.name = name;
        this.type = type;
    }

    @Override
    public PrgState execute(PrgState state) throws StatementException {
        if (state.getSymTable().contains(this.name)){
            throw new RuntimeException("The variable was already declared!");
        }
        state.getSymTable().insert(this.name, this.type.getDefaultValue());
        return null;
    }

    @Override
    public String toString(){
        return "(IF(" + this.name + ", " + this.type + "))";
    }

    public IStatement deepCopy(){
        return new VarDeclStatement(this.name, this.type);
    }

    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnvironment) throws StatementException {
        typeEnvironment.insert(this.name, this.type);
        return typeEnvironment;
    }
}
