package controller;

import model.adt.MyDictionary;
import model.adt.MyIDictionary;
import model.adt.MyIList;
import model.adt.MyIStack;
import model.state.PrgState;
import model.statements.IStatement;
import model.type.RefType;
import model.value.IValue;
import model.value.RefValue;
import repository.IRepository;
import exceptions.GeneralException;
import exceptions.StatementException;
import exceptions.ExpressionException;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Controller {
    private final IRepository repo;
    private ExecutorService executor;
    private boolean displayFlag;

    public Controller(IRepository repo, boolean displayFlag) {
        this.repo = repo;
        this.displayFlag = displayFlag;
    }

    public IRepository getRepo() {
        return repo;
    }

    public void setDisplayFlag(boolean displayFlag) {
        this.displayFlag = displayFlag;
    }

    public void addProgram(IStatement statement) {
        repo.addProgramState(new PrgState(statement));
    }

    List<PrgState> removeCompletedPrograms(List<PrgState> programStates) {
        return programStates.stream()
                .filter(PrgState::isNotCompleted) // only keep programs with non-empty execution stacks
                .collect(Collectors.toList());
    }

    public List<Integer> getAddrFromSymTable(Collection<IValue> symTableValues) {
        return symTableValues.stream()
                .filter(v -> v instanceof RefValue)
                .map(v -> {RefValue v1 = (RefValue) v; return v1.getAddress();})
                .collect(Collectors.toList());
    }

    public List<Integer> getAddrFromHeap(Collection<IValue> heapValues) {
        return heapValues.stream()
                .filter(v -> v instanceof RefValue)
                .map(v -> {RefValue v1 = (RefValue) v; return v1.getAddress();})
                .collect(Collectors.toList());
    }

    public Map<Integer, IValue> safeGarbageCollector(List<Integer> symTableAddr, List<Integer> heapAddr, Map<Integer, IValue> heap) {
        return heap.entrySet().stream()
                .filter(e -> ( symTableAddr.contains(e.getKey()) || heapAddr.contains(e.getKey())))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public void conservativeGarbageCollector(List<PrgState> programStates) {
        List<Integer> symTableAddresses = Objects.requireNonNull(programStates.stream()
                        .map(p -> getAddrFromSymTable(p.getSymTable().getDictionary().values()))
                        .map(Collection::stream)
                        .reduce(Stream::concat).orElse(null))
                .collect(Collectors.toList());
        programStates.forEach(p -> {
            p.getHeap().setContent((HashMap<Integer, IValue>)
                    safeGarbageCollector(symTableAddresses, getAddrFromHeap(p.getHeap().getContent().values()), p.getHeap().getContent()));
        });
    }

    public void executeOneStepForAllPrograms(List<PrgState> programStates) throws InterruptedException {
        programStates.forEach(programState -> {
            try {
                repo.logProgramStateExecution(programState);
                displayCurrentState(programState);
            } catch (IOException e) {
                System.out.println("\u001B[31m" + e.getMessage() + "\u001B[0m");
            }
        });

        List<Callable<PrgState>> callList = programStates.stream()
                .map((PrgState p) -> (Callable<PrgState>) (p::executeOneStep))
                .collect(Collectors.toList());

        List<PrgState> newProgramList = executor.invokeAll(callList).stream()
                .map(future -> {
                    try {
                        return future.get();
                    } catch (ExecutionException | InterruptedException e) {
                        System.out.println("\u001B[31m" + e.getMessage() + "\u001B[0m");
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // add all new forked threads to the programStates list
        programStates.addAll(newProgramList);


        programStates.forEach(programState -> {
            try {
                repo.logProgramStateExecution(programState);
                displayCurrentState(programState);
            } catch (IOException e) {
                System.out.println("\u001B[31m" + e.getMessage() + "\u001B[0m");
            }
        });
        repo.setProgramStates(programStates);
    }

    public void typeCheckRunner (IStatement statement, int exampleNumber) throws GeneralException {
        try {
            statement.typeCheck(new MyDictionary<>());
        } catch (ExpressionException | StatementException e) {
            throw new GeneralException("Type check failed at example" + exampleNumber);
        }
    }

    public void allStep() throws InterruptedException {
        executor = Executors.newFixedThreadPool(2);
        List<PrgState> programStates = removeCompletedPrograms(repo.getProgramStates());

        while (!programStates.isEmpty()) { // run while there are active threads
            conservativeGarbageCollector(programStates); // perform garbage collection
            executeOneStepForAllPrograms(programStates); // execute one step for all threads
            programStates = removeCompletedPrograms(repo.getProgramStates()); // filter completed threads
        }

        executor.shutdownNow();
        repo.setProgramStates(programStates); // update the repo with the final state
    }

    public void oneStep() throws InterruptedException {
        executor = Executors.newFixedThreadPool(2);
        List<PrgState> programStates = removeCompletedPrograms(repo.getProgramStates());

        if (programStates.size() > 0) {
            conservativeGarbageCollector(programStates);
            executeOneStepForAllPrograms(programStates);
            programStates = removeCompletedPrograms(repo.getProgramStates());
        }

        executor.shutdownNow();
        repo.setProgramStates(programStates);
    }

    public void displayCurrentState(PrgState programState) {
        System.out.println(programState.toString() + "\n");
    }
}