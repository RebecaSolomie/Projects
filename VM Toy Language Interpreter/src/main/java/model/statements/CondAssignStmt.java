package model.statements;

import exceptions.GeneralException;
import model.state.PrgState;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.type.BoolType;
import model.type.IType;

public class CondAssignStmt implements IStatement {
    String varName;
    IExpression exp1, exp2, exp3;

    public CondAssignStmt(String varName, IExpression exp1, IExpression exp2, IExpression exp3){
        this.varName = varName;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.exp3 = exp3;
    }

    @Override
    public PrgState execute(PrgState state) throws GeneralException {
        IStatement newStmt = new IfStatement(exp1, new AssignStatement(varName, exp2), new AssignStatement(varName, exp3));
        state.getExecStack().push(newStmt);
        return null;
    }

    @Override
    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnv) throws GeneralException {
        IType type1 = exp1.typeCheck(typeEnv);
        IType type2 = exp2.typeCheck(typeEnv);
        IType type3 = exp3.typeCheck(typeEnv);

        IType varType = typeEnv.get(varName);

        if(type1.equals(new BoolType()) && varType.equals(type2) && varType.equals(type3))
        {
            return typeEnv;
        }
        throw new GeneralException("CondAssignStmt: invalid types of expressions/variable!");
    }

    @Override
    public IStatement deepCopy() {
        return new CondAssignStmt(varName, exp1.deepCopy(), exp2.deepCopy(), exp3.deepCopy());
    }

    @Override
    public String toString() {
        return varName + "= " + exp1 + " ? " + exp2 + " : " + exp3;
    }
}
