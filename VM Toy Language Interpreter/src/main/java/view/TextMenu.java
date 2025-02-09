package view;

import exceptions.GeneralException;
import model.adt.MyDictionary;
import view.commands.Command;

import java.util.Scanner;

public class TextMenu {
    private final MyDictionary<String, Command> commands;

    public TextMenu() {
        commands = new MyDictionary<>();
    }

    public void addCommand(Command command) {
        commands.insert(command.getKey(), command);
    }

    private void printMenu() {
        for (Command command: commands.getDictionary().values()) {
            String line = String.format("%s. %s", command.getKey(), command.getDescription());
            System.out.println(line);
        }
    }

    public void show() {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("Input the number associated to your option: ");
            printMenu();
            System.out.println(">>> ");

            try {
                String key = scanner.nextLine();

                boolean valid = false;
                for (int i = 0; i <= commands.getDictionary().size(); i++) {
                    if (key.equals(Integer.toString(i))) {
                        valid = true;
                    }
                }
                if(!valid) {
                    throw new GeneralException("Invalid input!");
                }

                Command command = commands.get(key);
                command.execute();
            } catch(GeneralException e) {
                System.out.println("\u001B[31m" + e.getMessage() + "\u001B[0m");
            }
        }
    }
}