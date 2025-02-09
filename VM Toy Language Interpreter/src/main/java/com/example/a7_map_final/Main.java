package com.example.a7_map_final;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class Main extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) throws IOException {

        // Load the main window
        FXMLLoader mainLoader = new FXMLLoader();
        mainLoader.setLocation(getClass().getResource("MainWindow.fxml"));
        Parent mainWindow = mainLoader.load();

        // Get the controller for the main window
        MainWindowController mainWindowController = mainLoader.getController();

        // Set up the main stage with title and dimensions
        primaryStage.setTitle("Main Window");
        Scene mainScene = new Scene(mainWindow, 1000, 800);

        // Add background color for differentiation
        mainScene.getRoot().setStyle("-fx-background-color: #ADD8E6;"); // Light blue

        primaryStage.setScene(mainScene);
        primaryStage.show();

        // Load the select window
        FXMLLoader secondaryLoader = new FXMLLoader();
        secondaryLoader.setLocation(getClass().getResource("SelectWindow.fxml"));
        Parent secondaryWindow = secondaryLoader.load();

        // Get the controller for the select window and link it with the main controller
        SelectWindowController selectWindowController = secondaryLoader.getController();
        selectWindowController.setMainWindowController(mainWindowController);

        // Set up the secondary stage with title and dimensions
        Stage secondaryStage = new Stage();
        secondaryStage.setTitle("Select Window");
        Scene secondaryScene = new Scene(secondaryWindow, 600, 650);

        // Add background color for differentiation
        secondaryScene.getRoot().setStyle("-fx-background-color: #FFC0CB;"); // Light pink

        secondaryStage.setScene(secondaryScene);
        secondaryStage.show();
    }
}
