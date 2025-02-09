package model.statements;

import exceptions.GeneralException;
import model.state.PrgState;
import model.adt.MyIDictionary;
import model.adt.MyIStack;
import model.expressions.IExpression;
import model.expressions.RelationalExpression;
import model.expressions.VarExpression;
import model.type.IType;
import model.type.IntType;
import model.type.StringType;

public class ForStmt implements IStatement{
    String varName;
    IExpression exp1, exp2, exp3;
    IStatement givenStmt;

    public ForStmt(String varName, IExpression exp1, IExpression exp2, IExpression exp3, IStatement givenStmt){
        this.varName = varName;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.exp3 = exp3;
        this.givenStmt = givenStmt;
    }

    @Override
    public PrgState execute(PrgState state) throws GeneralException {
        //// model 1
        /* IStatement newStmt =  new CompStatement(new AssignStatement(varName, exp1),
                new WhileStatement(new RelationalExpression(new VarExpression(varName), exp2, "<"),
                        new CompStatement(givenStmt, new AssignStatement(varName, exp3)))); */

        //// model 2
        IStatement newStmt = new CompStatement(new VarDeclStatement(varName, new IntType()),
                new CompStatement(new AssignStatement(varName, exp1),
                        new WhileStatement(new RelationalExpression(new VarExpression(varName), exp2, "<"),
                                new CompStatement(givenStmt, new AssignStatement(varName, exp3)))
                        ));
        state.getExecStack().push(newStmt);
        return null;
    }

    @Override
    public MyIDictionary<String, IType> typeCheck(MyIDictionary<String, IType> typeEnv) throws GeneralException {

        //// model 2
        typeEnv.update(varName, new IntType());

        IType type1 = exp1.typeCheck(typeEnv);
        IType type2 = exp2.typeCheck(typeEnv);
        IType type3 = exp3.typeCheck(typeEnv);

        if(type1.equals(new IntType()) && type2.equals(new IntType()) && type3.equals(new IntType()))
            return typeEnv;
        throw new GeneralException("ForStmt: The expression isn't of int type!");
    }

    @Override
    public IStatement deepCopy() {
        return new ForStmt(varName, exp1.deepCopy(), exp2.deepCopy(), exp3.deepCopy(), givenStmt.deepCopy());
    }

    @Override
    public String toString() {
        return "for(" + varName + " = " + exp1 + "; " + varName + " < " + exp2 + "; " + varName + " = " + exp3 + ") {" + givenStmt + "}";
    }
}
