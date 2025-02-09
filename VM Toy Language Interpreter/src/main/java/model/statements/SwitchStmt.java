package model.statements;

import exceptions.GeneralException;
import model.state.PrgState;
import model.adt.MyIDictionary;
import model.expressions.IExpression;
import model.expressions.RelationalExpression;
import model.type.IType;
import model.value.IValue;

public class SwitchStmt implements IStatement{
    IExpression givenExp, exp1, exp2;
    IStatement stmt1, stmt2, defaultStmt;

    public SwitchStmt(IExpression givenExp, IExpression exp1, IStatement stmt1, IExpression exp2, IStatement stmt2, IStatement defaultStmt){
        this.givenExp = givenExp;
        this.exp1 = exp1;
        this.stmt1 = stmt1;
        this.exp2 = exp2;
        this.stmt2 = stmt2;
        this.defaultStmt = defaultStmt;
    }

    @Override
    public PrgState execute(PrgState state) throws GeneralException {
        IStatement newStmt = new IfStatement(new RelationalExpression(givenExp, exp1, "=="), stmt1, new IfStatement(new RelationalExpression(givenExp, exp2, "=="), stmt2, defaultStmt));
        state.getExecStack().push(newStmt);
        return null;
    }

    @Override
    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnv) throws GeneralException {
        IType type1 = givenExp.typeCheck(typeEnv);
        IType type2 = exp1.typeCheck(typeEnv);
        IType type3 = exp2.typeCheck(typeEnv);

        if(type1.equals(type2) && type1.equals(type3)){
            stmt1.typeCheck(typeEnv.copy());
            stmt2.typeCheck(typeEnv.copy());
            defaultStmt.typeCheck(typeEnv.copy());
            return typeEnv;
        }

        throw new GeneralException("SwitchStmt: expressions don't have the same type!");

    }

    @Override
    public IStatement deepCopy() {
        return new SwitchStmt(givenExp.deepCopy(), exp1.deepCopy(), stmt1.deepCopy(), exp2.deepCopy(), stmt2.deepCopy(), defaultStmt.deepCopy());
    }

    @Override
    public String toString() {
        return "switch(" + givenExp + ") (case (" + exp1 + ") : {" + stmt1 + "}) (case (" + exp2 + ") : {" + stmt2 + "}) (default : {" + defaultStmt + "})";
    }
}
