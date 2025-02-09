package model.statements;

import exceptions.GeneralException;
import model.state.PrgState;
import model.adt.MyIDictionary;
import model.adt.MyIStack;
import model.expressions.IExpression;
import model.type.BoolType;
import model.type.IType;

public class DoWhileStmt implements IStatement{
    IStatement stmt;
    IExpression exp;

    public DoWhileStmt(IExpression exp, IStatement stmt){
        this.stmt = stmt;
        this.exp = exp;
    }

    @Override
    public PrgState execute(PrgState state) throws GeneralException {
        IStatement newStmt = new CompStatement(stmt, new WhileStatement(exp, stmt));
        state.getExecStack().push(newStmt);
        return null;
    }

    @Override
    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnv) throws GeneralException {
        IType type = exp.typeCheck(typeEnv);
        if(type.equals(new BoolType()))
        {
            stmt.typeCheck(typeEnv.copy());
            return typeEnv;
        }
        throw new GeneralException("DoWhileStmt: expression must be of bool type!");

    }

    @Override
    public IStatement deepCopy() {
        return new DoWhileStmt(exp.deepCopy(), stmt.deepCopy());
    }

    @Override
    public String toString() {
        return "do{ " + stmt + " }while(" + exp + ")";
    }
}
