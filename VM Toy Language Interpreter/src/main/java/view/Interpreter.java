package view;

import controller.Controller;
import model.expressions.*;
import model.state.PrgState;
import model.statements.*;
import model.type.BoolType;
import model.type.IntType;
import model.type.RefType;
import model.type.StringType;
import model.value.BoolValue;
import model.value.IntValue;
import model.value.StringValue;
import repository.IRepository;
import repository.Repository;
import view.commands.ExitCommand;
import view.commands.RunExampleCommand;

public class Interpreter {
    public static void run(){
        /* int v; v=2; Print(v) */
        IStatement ex1 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(2))),
                        new PrintStatement(new VarExpression("v"))));
        IRepository repo1 = new Repository( "log1.txt");
        Controller controller1 = new Controller(repo1, true);
        controller1.typeCheckRunner(ex1, 1);
        controller1.addProgram(ex1);

        /* int a; int b; a=2+3*5; b=a+1; Print(b) */
        IStatement ex2 = new CompStatement(new VarDeclStatement("a",new IntType()),
                new CompStatement(new VarDeclStatement("b",new IntType()),
                        new CompStatement(new AssignStatement("a", new ArithmeticExpression(new ValueExpression(new IntValue(2)),new
                                ArithmeticExpression(new ValueExpression(new IntValue(3)), new ValueExpression(new IntValue(5)), ArithmeticOperation.MULTIPLY), ArithmeticOperation.ADD)),
                                new CompStatement(new AssignStatement("b",new ArithmeticExpression(new VarExpression("a"), new ValueExpression(new
                                        IntValue(1)), ArithmeticOperation.ADD)), new PrintStatement(new VarExpression("b"))))));
        IRepository repo2 = new Repository("log2.txt");
        Controller controller2 = new Controller(repo2, true);
        controller2.typeCheckRunner(ex2, 2);
        controller2.addProgram(ex2);

        /* bool a; int v; a=true; (If a Then v=2 Else v=3); Print(v) */
        IStatement ex3 = new CompStatement(new VarDeclStatement("a", new BoolType()),
                new CompStatement(new VarDeclStatement("v", new IntType()),
                        new CompStatement(new AssignStatement("a", new ValueExpression(new BoolValue(true))),
                                new CompStatement(new IfStatement(new VarExpression("a"),
                                        new AssignStatement("v", new ValueExpression(new IntValue(2))),
                                        new AssignStatement("v", new ValueExpression(new IntValue(3)))),
                                        new PrintStatement(new VarExpression("v"))))));
        IRepository repo3 = new Repository("log3.txt");
        Controller controller3 = new Controller(repo3, true);
        controller3.typeCheckRunner(ex3, 3);
        controller3.addProgram(ex3);

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
        IRepository repo4 = new Repository("log4.txt");
        Controller controller4 = new Controller(repo4, true);
        controller4.typeCheckRunner(ex4, 4);
        controller4.addProgram(ex4);

        /* int a; int b; a=5; b=7; if a>b then print(a) else print(b) */
        IStatement ex5 = new CompStatement(new VarDeclStatement("a", new IntType()),
                new CompStatement(new VarDeclStatement("b", new IntType()),
                        new CompStatement(new AssignStatement("a", new ValueExpression(new IntValue(5))),
                                new CompStatement(new AssignStatement("b", new ValueExpression(new IntValue(7))),
                                        new IfStatement(new RelationalExpression(new VarExpression("a"),
                                                new VarExpression("b"), ">"),new PrintStatement(new VarExpression("a")),
                                                new PrintStatement(new VarExpression("b")))))));
        IRepository repo5 = new Repository("log5.txt");
        Controller controller5 = new Controller(repo5, true);
        controller5.typeCheckRunner(ex5, 5);
        controller5.addProgram(ex5);

        /* int v; v=4; (while (v>0) print(v); v=v-1); print(v) */
        IStatement ex6 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(4))),
                        new CompStatement(new WhileStatement(new RelationalExpression(new VarExpression("v"), new ValueExpression(new IntValue(0)), ">"),
                                new CompStatement(new PrintStatement(new VarExpression("v")), new AssignStatement("v",
                                        new ArithmeticExpression(new VarExpression("v"), new ValueExpression(new IntValue(1)), ArithmeticOperation.SUBTRACT)))),
                                new PrintStatement(new VarExpression("v")))));
        IRepository repo6 = new Repository("log6.txt");
        Controller controller6 = new Controller(repo6, true);
        controller6.typeCheckRunner(ex6, 6);
        controller6.addProgram(ex6);

        /* Ref int v; new(v,20); Ref Ref int a; new(a,v); print(v); print(a) */
        IStatement ex7 = new CompStatement(new VarDeclStatement("v", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(20))),
                        new CompStatement(new VarDeclStatement("a", new RefType(new RefType(new IntType()))),
                                new CompStatement(new HeapAllocationStatement("a", new VarExpression("v")),
                                        new CompStatement(new PrintStatement(new VarExpression("v")), new PrintStatement(new VarExpression("a")))))));
        IRepository repo7 = new Repository("log7.txt");
        Controller controller7 = new Controller(repo7, true);
        controller7.typeCheckRunner(ex7, 7);
        controller7.addProgram(ex7);

        /* Ref int v; new(v,20); Ref Ref int a; new(a,v); print(rH(v)); print(rH(rH(a))+5) */
        IStatement ex8 = new CompStatement(new VarDeclStatement("v", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(20))),
                        new CompStatement(new VarDeclStatement("a", new RefType(new RefType(new IntType()))),
                                new CompStatement(new HeapAllocationStatement("a", new VarExpression("v")),
                                        new CompStatement(new PrintStatement(new HeapReadExpression(new VarExpression("v"))),
                                                new PrintStatement(new ArithmeticExpression(new HeapReadExpression(new HeapReadExpression(new VarExpression("a"))), new ValueExpression(new IntValue(5)), ArithmeticOperation.ADD)))))));
        IRepository repo8 = new Repository("log8.txt");
        Controller controller8 = new Controller(repo8, true);
        controller8.typeCheckRunner(ex8, 8);
        controller8.addProgram(ex8);

        /* Ref int v; new(v,20); print(rH(v)); wH(v,30); print(rH(v)+5); */
        IStatement ex9 = new CompStatement(new VarDeclStatement("v", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(20))),
                        new CompStatement( new PrintStatement(new HeapReadExpression(new VarExpression("v"))),
                                new CompStatement(new HeapWriteStatement("v", new ValueExpression(new IntValue(30))),
                                        new PrintStatement(new ArithmeticExpression( new HeapReadExpression(new VarExpression("v")), new ValueExpression(new IntValue(5)), ArithmeticOperation.ADD))))));
        IRepository repo9 = new Repository("log9.txt");
        Controller controller9 = new Controller(repo9, true);
        controller9.typeCheckRunner(ex9, 9);
        controller9.addProgram(ex9);

        /* Ref int v; new(v,20); Ref Ref int a; new(a,v); new(v,30); print(rH(rH(a))) */
        IStatement ex10 = new CompStatement(new VarDeclStatement("v", new RefType(new IntType())),
                new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(20))),
                        new CompStatement(new VarDeclStatement("a", new RefType(new RefType(new IntType()))),
                                new CompStatement(new HeapAllocationStatement("a", new VarExpression("v")),
                                        new CompStatement(new HeapAllocationStatement("v", new ValueExpression(new IntValue(30))),
                                                new PrintStatement(new HeapReadExpression(new HeapReadExpression(new VarExpression("a")))))))));
        IRepository repo10 = new Repository("log10.txt");
        Controller controller10 = new Controller(repo10, true);
        controller10.typeCheckRunner(ex10, 10);
        controller10.addProgram(ex10);

        /* int v; Ref int a; v=10; new(a,22); fork(wH(a,30); v=32; print(v); print(rH(a))); print(v); print(rH(a)) */
        IStatement ex11 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new VarDeclStatement("a", new RefType(new IntType())),
                        new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(10))),
                                new CompStatement(new HeapAllocationStatement("a", new ValueExpression(new IntValue(22))),
                                        new CompStatement(new ForkStatement(new CompStatement(new HeapWriteStatement("a", new ValueExpression(new IntValue(30))),
                                                new CompStatement(new AssignStatement("v", new ValueExpression(new IntValue(32))),
                                                        new CompStatement(new PrintStatement(new VarExpression("v")), new PrintStatement(new HeapReadExpression(new VarExpression("a"))))))),
                                                new CompStatement(new PrintStatement(new VarExpression("v")), new PrintStatement(new HeapReadExpression(new VarExpression("a")))))))));
        IRepository repo11 = new Repository("log11.txt");
        Controller controller11 = new Controller(repo11, true);
        controller11.typeCheckRunner(ex11, 11);
        controller11.addProgram(ex11);

        /*int v; v = a; print (v)*/
        IStatement ex12 = new CompStatement(new VarDeclStatement("v", new IntType()),
                new CompStatement(new AssignStatement("v", new VarExpression("a")),
                        new PrintStatement(new VarExpression("v"))));
        IRepository repo12 = new Repository("log12.txt");
        Controller controller12 = new Controller(repo12, true);
        try {
            controller12.typeCheckRunner(ex12, 12);
            controller12.addProgram(ex12 );
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }


        TextMenu menu = new TextMenu();

        menu.addCommand(new RunExampleCommand("1", ex1.toString(), controller1));
        menu.addCommand(new RunExampleCommand("2", ex2.toString(), controller2));
        menu.addCommand(new RunExampleCommand("3", ex3.toString(), controller3));
        menu.addCommand(new RunExampleCommand("4", ex4.toString(), controller4));
        menu.addCommand(new RunExampleCommand("5", ex5.toString(), controller5));
        menu.addCommand(new RunExampleCommand("6", ex6.toString(), controller6));
        menu.addCommand(new RunExampleCommand("7", ex7.toString(), controller7));
        menu.addCommand(new RunExampleCommand("8", ex8.toString(), controller8));
        menu.addCommand(new RunExampleCommand("9", ex9.toString(), controller9));
        menu.addCommand(new RunExampleCommand("10", ex10.toString(), controller10));
        menu.addCommand(new RunExampleCommand("11", ex11.toString(), controller11));
        if (controller12.getRepo().getProgramStates().size() > 0)
            menu.addCommand(new RunExampleCommand("12", ex12.toString(), controller12));
        menu.addCommand(new ExitCommand("13", "Exit!"));

        menu.show();
    }
}