package repository;

import model.state.PrgState;
import model.statements.PrintStatement;

import java.io.IOException;
import java.util.List;

public interface IRepository {
    List<PrgState> getProgramStates();

    void setProgramStates(List<PrgState> newList);

    void addProgramState(PrgState newProgramState);

    void logProgramStateExecution(PrgState programState) throws IOException;

}
