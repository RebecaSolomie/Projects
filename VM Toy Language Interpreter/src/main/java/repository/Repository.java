package repository;

import exceptions.RepositoryException;
import model.state.PrgState;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class Repository implements IRepository {
    private List<PrgState> programStates;
    private final String logFilePath;

    public Repository(String logFilePath) {
        programStates = new LinkedList<>();
        this.logFilePath = logFilePath;
    }

    @Override
    public List<PrgState> getProgramStates() {
        return this.programStates;
    }

    @Override
    public void setProgramStates(List<PrgState> newProgramStates) {
        programStates = newProgramStates;
    }

    @Override
    public void addProgramState(PrgState newProgramState) {
        programStates.add(newProgramState);
    }

    @Override
    public void logProgramStateExecution(PrgState programState) throws IOException {
        PrintWriter logFile;
        logFile = new PrintWriter(new BufferedWriter(new FileWriter(logFilePath, true)));
        logFile.println(programState);
        logFile.close();
    }
}
