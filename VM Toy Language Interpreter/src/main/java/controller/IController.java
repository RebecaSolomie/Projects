package controller;

import exceptions.ControllerException;
import exceptions.EmptyStackException;
import exceptions.ExpressionException;
import exceptions.StatementException;
import model.state.PrgState;
import model.statements.IStatement;
import repository.IRepository;

import java.io.IOException;
import java.sql.Statement;

public interface IController {
    void executeOneStep(PrgState state) throws StatementException, ExpressionException, IOException, EmptyStackException;
    void executeAllSteps() throws StatementException, ExpressionException, IOException, EmptyStackException;
    void setDisplayFlag(boolean flag);

    IRepository getRepository();

    void addProgram(IStatement statement);
    void displayCurrentState(PrgState state);
}
