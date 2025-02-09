package com.example.a7_map_final;

import controller.Controller;
import model.adt.*;
import model.expressions.*;
import model.state.PrgState;
import model.statements.*;
import model.type.*;
import model.value.BoolValue;
import model.value.IValue;
import model.value.IntValue;
import model.value.StringValue;
import repository.IRepository;
import repository.Repository;
import javafx.collections.FXCollections;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ListView;

import java.io.BufferedReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;
public class SelectWindowController implements Initializable {
    @FXML
    private Button selectBttn;
    @FXML
    private ListView<IStatement> selectItemListView;

    private MainWindowController mainWindowController;

    public MainWindowController getMainWindowController() {
        return mainWindowController;
    }

    public void setMainWindowController(MainWindowController mainWindowController) {
        this.mainWindowController = mainWindowController;
    }

    @FXML
    private IStatement selectExample(ActionEvent actionEvent) {
        return selectItemListView.getItems().get(selectItemListView.getSelectionModel().getSelectedIndex());
    }

    private List<IStatement> initExamples(){
        List<IStatement> list = new ArrayList<>();

        /* int v; v=2; Print(v) */
        IStatement ex1 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(2))),
                        new PrintStatement(new VarExpression("v"))));

        /* int a; int b; a=2+3*5; b=a+1; Print(b) */
        IStatement ex2 = new CompStatement(new VarDeclStatement("a",new IntType()),
                new CompStatement(new VarDeclStatement("b",new IntType()),
                        new CompStatement(new AssignStatement("a", new ArithmeticExpression(new ValueExpression(new IntValue(2)),new
                                ArithmeticExpression(new ValueExpression(new IntValue(3)), new ValueExpression(new IntValue(5)), ArithmeticOperation.MULTIPLY), ArithmeticOperation.ADD)),
                                new CompStatement(new AssignStatement("b",new ArithmeticExpression(new VarExpression("a"), new ValueExpression(new
                                        IntValue(1)), ArithmeticOperation.ADD)), new PrintStatement(new VarExpression("b"))))));

        /* bool a; int v; a=true; (If a Then v=2 Else v=3); Print(v) */
        IStatement ex3 = new CompStatement(new VarDeclStatement("a", new BoolType()),
                new CompStatement(new VarDeclStatement("v", new IntType()),
                        new CompStatement(new AssignStatement("a", new ValueExpression(new BoolValue(true))),
                                new CompStatement(new IfStatement(new VarExpression("a"),
                                        new AssignStatement("v", new ValueExpression(new IntValue(2))),
                                        new AssignStatement("v", new ValueExpression(new IntValue(3)))),
                                        new PrintStatement(new VarExpression("v"))))));

        /* string varf; varf="test.in"; openRFile(varf); int varc; read(varf,varc); print(varc); read(varf,varc); print(varc); closeRFile(varf) */
        IStatement ex4 = new CompStatement(new VarDeclStatement("varf", new StringType()),
                new CompStatement(new AssignStatement("varf", new ValueExpression(
                        new StringValue("test.in"))),
                        new CompStatement(new OpenReadFileStatement(new VarExpression("varf")),
                                new CompStatement(new VarDeclStatement("varc", new IntType()),
                                        new CompStatement(new AssignStatement("varc", new ValueExpression(new IntValue(0))),
                                                new CompStatement(new ReadFileStatement(
                                                        new VarExpression("varf"), "varc"),
                                                        new CompStatement(new PrintStatement(new VarExpression("varc")),
                                                                new CompStatement(new ReadFileStatement(
                                                                        new VarExpression("varf"), "varc"),
                                                                        new CompStatement(
                                                                                new PrintStatement(
                                                                                        new VarExpression("varc")),
                                                                                new CloseReadFileStatement(
                                                                                        new VarExpression("varf")))))))))));

        /* int a; int b; a=5; b=7; if a>b then print(a) else print(b) */
        IStatement ex5 = new CompStatement(new VarDeclStatement("a", new IntType()),
                new CompStatement(new VarDeclStatement("b", new IntType()),
                        new CompStatement(new AssignStatement("a", new ValueExpression(new IntValue(5))),
                                new CompStatement(new AssignStatement("b", new ValueExpression(new IntValue(7))),
                                        new IfStatement(new RelationalExpression(new VarExpression("a"),
                                                new VarExpression("b"), ">"),new PrintStatement(new VarExpression("a")),
                                                new PrintStatement(new VarExpression("b")))))));

        /* int v; v=4; (while (v>0) print(v); v=v-1); print(v) */
        IStatement ex6 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(4))),
                        new CompStatement(new WhileStatement(new RelationalExpression(new VarExpression("v"), new ValueExpression(new IntValue(0)), ">"),
                                new CompStatement(new PrintStatement(new VarExpression("v")), new AssignStatement("v",
                                        new ArithmeticExpression(new VarExpression("v"), new ValueExpression(new IntValue(1)), ArithmeticOperation.SUBTRACT)))),
                                new PrintStatement(new VarExpression("v")))));

        /* Ref int v; new(v,20); Ref Ref int a; new(a,v); print(v); print(a) */
        IStatement ex7 = new CompStatement(new VarDeclStatement("v", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(20))),
                        new CompStatement(new VarDeclStatement("a", new RefType(new RefType(new IntType()))),
                                new CompStatement(new HeapAllocationStatement("a", new VarExpression("v")),
                                        new CompStatement(new PrintStatement(new VarExpression("v")), new PrintStatement(new VarExpression("a")))))));

        /* Ref int v; new(v,20); Ref Ref int a; new(a,v); print(rH(v)); print(rH(rH(a))+5) */
        IStatement ex8 = new CompStatement(new VarDeclStatement("v", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(20))),
                        new CompStatement(new VarDeclStatement("a", new RefType(new RefType(new IntType()))),
                                new CompStatement(new HeapAllocationStatement("a", new VarExpression("v")),
                                        new CompStatement(new PrintStatement(new HeapReadExpression(new VarExpression("v"))),
                                                new PrintStatement(new ArithmeticExpression(new HeapReadExpression(new HeapReadExpression(new VarExpression("a"))), new ValueExpression(new IntValue(5)), ArithmeticOperation.ADD)))))));

        /* Ref int v; new(v,20); print(rH(v)); wH(v,30); print(rH(v)+5); */
        IStatement ex9 = new CompStatement(new VarDeclStatement("v", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(20))),
                        new CompStatement( new PrintStatement(new HeapReadExpression(new VarExpression("v"))),
                                new CompStatement(new HeapWriteStatement("v", new ValueExpression(new IntValue(30))),
                                        new PrintStatement(new ArithmeticExpression( new HeapReadExpression(new VarExpression("v")), new ValueExpression(new IntValue(5)), ArithmeticOperation.ADD))))));

        /* Ref int v; new(v,20); Ref Ref int a; new(a,v); new(v,30); print(rH(rH(a))) */
        IStatement ex10 = new CompStatement(new VarDeclStatement("v", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(20))),
                        new CompStatement(new VarDeclStatement("a", new RefType(new RefType(new IntType()))),
                                new CompStatement(new HeapAllocationStatement("a", new VarExpression("v")),
                                        new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(30))),
                                                new PrintStatement(new HeapReadExpression(new HeapReadExpression(new VarExpression("a")))))))));

        /* int v; Ref int a; v=10; new(a,22); fork(wH(a,30); v=32; print(v); print(rH(a))); print(v); print(rH(a)) */
        IStatement ex11 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new VarDeclStatement("a", new RefType(new IntType())),
                        new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(10))),
                                new CompStatement(new HeapAllocationStatement("a", new ValueExpression(new IntValue(22))),
                                        new CompStatement(new ForkStatement(new CompStatement(new HeapWriteStatement("a", new ValueExpression(new IntValue(30))),
                                                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(32))),
                                                        new CompStatement(new PrintStatement(new VarExpression("v")), new PrintStatement(new HeapReadExpression(new VarExpression("a"))))))),
                                                new CompStatement(new PrintStatement(new VarExpression("v")), new PrintStatement(new HeapReadExpression(new VarExpression("a")))))))));

        ///ForStmt
        IStatement ex12 = new CompStatement(new VarDeclStatement("a", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("a", new ValueExpression(new IntValue(20))),
                        new CompStatement(new ForStmt("v", new ValueExpression(new IntValue(0)), new ValueExpression(new IntValue(3)),
                                new ArithmeticExpression(new VarExpression("v"), new ValueExpression(new IntValue(1)), ArithmeticOperation.ADD), new ForkStatement(new CompStatement(new PrintStatement(new VarExpression("v")),
                                new AssignStatement("v", new ArithmeticExpression(new VarExpression("v"), new HeapReadExpression(new VarExpression("a")), ArithmeticOperation.MULTIPLY))
                        ))), new PrintStatement(new HeapReadExpression(new VarExpression("a"))))));
        
        ///SleepStmt
        IStatement ex13 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(10))),
                        new CompStatement(new ForkStatement(new CompStatement(new AssignStatement("v", new ArithmeticExpression(new VarExpression("v"), new ValueExpression(new IntValue(1)), ArithmeticOperation.SUBTRACT)),
                                new CompStatement(new AssignStatement("v", new ArithmeticExpression(new VarExpression("v"), new ValueExpression(new IntValue(1)), ArithmeticOperation.SUBTRACT)), new PrintStatement(new VarExpression("v"))
                                ))), new CompStatement(new SleepStmt(10), new PrintStatement(new ArithmeticExpression(new VarExpression("v"), new ValueExpression(new IntValue(10)), ArithmeticOperation.MULTIPLY))))));

        ///WaitStmt
        IStatement ex14 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(20))), new CompStatement(new WaitStmt(10),
                        new PrintStatement(new ArithmeticExpression(new VarExpression("v"), new ValueExpression(new IntValue(10)), ArithmeticOperation.MULTIPLY)))));

        ///RepeatUntilStmt
        IStatement ex15 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(0))),
                        new CompStatement(new RepeatUntilStmt(
                                new CompStatement(new ForkStatement(new CompStatement(new PrintStatement(new VarExpression("v")),
                                        new AssignStatement("v", new ArithmeticExpression( new VarExpression("v"), new ValueExpression(new IntValue(1)), ArithmeticOperation.SUBTRACT)))),
                                        new AssignStatement("v", new ArithmeticExpression( new VarExpression("v"), new ValueExpression(new IntValue(1)), ArithmeticOperation.ADD))),
                                new RelationalExpression( new VarExpression("v"), new ValueExpression(new IntValue(3)), "==")),
                                new CompStatement(new VarDeclStatement("x", new IntType()),
                                        new CompStatement(new VarDeclStatement("y", new IntType()),
                                                new CompStatement(new VarDeclStatement("z", new IntType()),
                                                        new CompStatement(new VarDeclStatement("w", new IntType()),
                                                                new CompStatement(new AssignStatement("x", new ValueExpression(new IntValue(1))),
                                                                        new CompStatement(new AssignStatement("y", new ValueExpression(new IntValue(2))),
                                                                                new CompStatement(new AssignStatement("z", new ValueExpression(new IntValue(3))),
                                                                                        new CompStatement(new AssignStatement("w", new ValueExpression(new IntValue(4))),
                                                                                                new PrintStatement(new ArithmeticExpression( new VarExpression("v"), new ValueExpression(new IntValue(10)), ArithmeticOperation.MULTIPLY)))))))))))));
        ///MulExp
        IStatement ex16 = new CompStatement(new VarDeclStatement("v1", new IntType()),
                new CompStatement(new VarDeclStatement("v2", new IntType()),
                        new CompStatement(new AssignStatement("v1", new ValueExpression(new IntValue(2))),
                                new CompStatement(new AssignStatement("v2", new ValueExpression(new IntValue(3))),
                                        new IfStatement(new RelationalExpression( new VarExpression("v1"), new ValueExpression(new IntValue(0)), "!="),
                                                new PrintStatement(new MulExpression(new VarExpression("v1"), new VarExpression("v2"))),
                                                new PrintStatement(new VarExpression("v1")))))));
        ///DoWhileStmt
        IStatement ex17 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(4))),
                        new CompStatement(new DoWhileStmt(new RelationalExpression( new VarExpression("v"), new ValueExpression(new IntValue(0)), ">"),
                                new CompStatement(new PrintStatement(new VarExpression("v")), new AssignStatement("v",new ArithmeticExpression( new VarExpression("v"), new ValueExpression(new IntValue(1)), ArithmeticOperation.SUBTRACT)))),
                                new PrintStatement(new VarExpression("v")))));
        /// SwitchStmt
        IStatement ex18 = new CompStatement(new VarDeclStatement("a", new IntType()),
                new CompStatement(new VarDeclStatement("b", new IntType()),
                        new CompStatement(new VarDeclStatement("c", new IntType()),
                                new CompStatement(new AssignStatement("a", new ValueExpression(new IntValue(1))),
                                        new CompStatement(new AssignStatement("b", new ValueExpression(new IntValue(2))),
                                                new CompStatement(new AssignStatement("c", new ValueExpression(new IntValue(5))),
                                                        new CompStatement(new SwitchStmt(
                                                                new ArithmeticExpression( new VarExpression("a"), new ValueExpression(new IntValue(10)), ArithmeticOperation.MULTIPLY),
                                                                new ArithmeticExpression( new VarExpression("b"), new VarExpression("c"), ArithmeticOperation.MULTIPLY),
                                                                new CompStatement(new PrintStatement(new VarExpression("a")), new PrintStatement(new VarExpression("b"))),
                                                                new ValueExpression(new IntValue(10)),
                                                                new CompStatement(new PrintStatement(new ValueExpression(new IntValue(100))), new PrintStatement(new ValueExpression(new IntValue(200)))),
                                                                new PrintStatement(new ValueExpression(new IntValue(300)))
                                                        ), new PrintStatement(new ValueExpression(new IntValue(300))))))))));

        /// CondAssign
        IStatement ex19 = new CompStatement(new VarDeclStatement("a", new RefType(new IntType())),
                new CompStatement(new VarDeclStatement("b", new RefType(new IntType())),
                        new CompStatement(new VarDeclStatement("v", new IntType()),
                                new CompStatement(new HeapAllocationStatement("a", new ValueExpression(new IntValue(0))),
                                        new CompStatement(new HeapAllocationStatement("b", new ValueExpression(new IntValue(0))),
                                                new CompStatement(new HeapWriteStatement("a", new ValueExpression(new IntValue(1))),
                                                        new CompStatement(new HeapWriteStatement("b", new ValueExpression(new IntValue(2))),
                                                                new CompStatement(new CondAssignStmt(
                                                                        "v",
                                                                        new RelationalExpression(new HeapReadExpression(new VarExpression("a")), new HeapReadExpression(new VarExpression("b")), "<"),
                                                                        new ValueExpression(new IntValue(100)), new ValueExpression(new IntValue(200))),
                                                                        new CompStatement(new PrintStatement(new VarExpression("v")), new CompStatement(
                                                                                new CondAssignStmt("v", new RelationalExpression(new ArithmeticExpression(new HeapReadExpression(new VarExpression("b")), new ValueExpression(new IntValue(2)), ArithmeticOperation.SUBTRACT), new HeapReadExpression(new VarExpression("a")), ">"),
                                                                                        new ValueExpression(new IntValue(100)), new ValueExpression(new IntValue(200))
                                                                                ), new PrintStatement(new VarExpression("v"))))))))))));

        IStatement ex20 = new CompStatement(new VarDeclStatement("b", new BoolType()),
                new CompStatement(new VarDeclStatement("c", new IntType()),
                        new CompStatement(new AssignStatement("b", new ValueExpression(new BoolValue(true))),
                                new CompStatement(new CondAssignStmt("c",
                                        new VarExpression("b"),
                                        new ValueExpression(new IntValue(100)),
                                        new ValueExpression(new IntValue(200))),
                                        new CompStatement(new PrintStatement(new VarExpression("c")),
                                                new CompStatement(new CondAssignStmt("c",
                                                        new ValueExpression(new BoolValue(false)),
                                                        new ValueExpression(new IntValue(100)),
                                                        new ValueExpression(new IntValue(200))),
                                                        new PrintStatement(new VarExpression("c"))))))));

        list.add(ex1);
        list.add(ex2);
        list.add(ex3);
        list.add(ex4);
        list.add(ex5);
        list.add(ex6);
        list.add(ex7);
        list.add(ex8);
        list.add(ex9);
        list.add(ex10);
        list.add(ex11);
        list.add(ex12);
        list.add(ex13);
        list.add(ex14);
        list.add(ex15);
        list.add(ex16);
        list.add(ex17);
        list.add(ex18);
        list.add(ex19);
        list.add(ex20);
        return list;
    }

    private void displayExamples(){
        List<IStatement> examples = initExamples();
        selectItemListView.setItems(FXCollections.observableArrayList(examples));
        selectItemListView.getSelectionModel().select(0);
        selectBttn.setOnAction(actionEvent -> {
            int index = selectItemListView.getSelectionModel().getSelectedIndex();
            IStatement selectedProgram = selectItemListView.getItems().get(index);
            index++;
            IRepository repository = new Repository("log" + index + ".txt");
            Controller controller = new Controller(repository, true);
            controller.addProgram(selectedProgram);
            try {
               controller.typeCheckRunner(selectedProgram, index-1);
                mainWindowController.setController(controller);
            } catch (Exception e) {
                Alert alert = new Alert(Alert.AlertType.ERROR,e.getMessage());
                alert.show();
            }
            //mainWindowController.setController(controller);
        });
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Styling the ListView for examples
        selectItemListView.setStyle("-fx-background-color: #E6E6FA; -fx-text-fill: #00008B;"); // Lavender background, dark blue text

        // Styling the select button
        selectBttn.setStyle("-fx-background-color: #90EE90; -fx-text-fill: #006400; -fx-font-weight: bold;"); // Light green background, dark green text, bold font

        displayExamples();
    }

}