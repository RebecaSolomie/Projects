#pragma once
#include "controller.h"
#include "user_controller.h"
#include <QWidget.h>
#include <QLabel>
#include <QPushButton>
#include <QListWidget>
#include <QLineEdit>
#include <QRadioButton>
#include <QShortcut>
#include <QTableView>
#include <QGridLayout>


class EventTableModel : public QAbstractTableModel {
private:
    UserRepository* repository;
public:
    explicit EventTableModel(UserRepository* newRepository);

    int rowCount(const QModelIndex& parent = QModelIndex()) const;
    int columnCount(const QModelIndex& parent = QModelIndex()) const;
    QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const;
    QVariant headerData(int section, Qt::Orientation orientation, int role = Qt::DisplayRole) const;
    void update();
};


class GUI : public QWidget {
private:
    Controller& controller;
    UserController& user_controller;
    Repository& repository;
    void initGUI();
    QLabel* titleWidget;
    QPushButton* adminButton;
    QPushButton* userButton;
    void showAdmin();
    void showUser();
    void connectSignalsAndSlots();
public:
    explicit GUI(Controller& _controller, UserController& _user_controller, Repository& _repo);
    ~GUI() override;
};

class AdminGUI : public QWidget {
private:
    Controller& controller;
    Repository& repository;

    void initAdminGUI();
    QLabel* titleWidget;
    QListWidget* eventListWidget;
    QLineEdit* titleLineEdit, * descriptionLineEdit, * dateLineEdit, * peopleLineEdit, * linkLineEdit;
    QPushButton* addButton, * deleteButton, * updateButton, * chartButton;
    QPushButton* undoButton, * redoButton;
    QShortcut* shortcutUndo, * shortcutRedo;

    void populateList();
    void connectSignalsAndSlots();
    void addEventUI();
    void deleteEventUI();
    void updateEventUI();
    void displayChart();

    void undoGUI();
    void redoGUI();

    QWidget* chartWindow;
public:
    explicit AdminGUI(QWidget* parent, Controller& _controller, Repository& _repo);
    ~AdminGUI() override;
};

class UserGUI : public QWidget {
private:
    Controller& controller;
    UserController& user_controller;

    void initUserGUI();
    QLabel* titleWidget;
    QListWidget* eventListWidget, * wishlistListWidget;
    QLineEdit* titleLineEdit, * descriptionLineEdit, * dateLineEdit, * peopleLineEdit, * linkLineEdit;
    QPushButton* searchButton, * openFileButton, * openListButton, * deleteEventButton, *openListTableButton;
    QRadioButton* csvButton, * htmlButton;

    QPushButton* undoButton, * redoButton;
    QShortcut* shortcutUndo, * shortcutRedo;

    QTableView* wishlistListTable;
    EventTableModel* wishlistListTableModel;
    QGridLayout* listAndTableLayout;

    bool repoTypeSelected;

    void createTable();
    void populateUserList();
    void connectSignalsAndSlots();
    void searchEventForUser();
    void showEventsForMonth(const QString& month);
    void displayEvent(const Event& event, QLabel* titleLabel, QLabel* descriptionLabel, QLabel* dateLabel, QPushButton* openLinkButton);
    void openListEventForUser();

    //void undoGUI();
    //void redoGUI();

public:
    explicit UserGUI(QWidget* parent, Controller& _controller, UserController& _user_controller);
    ~UserGUI() override;
};