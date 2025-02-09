#include <QVBoxLayout>
#include <QFormLayout>
#include <QLineEdit>
#include <QPushButton>
#include <QLabel>
#include <QMessageBox>
#include <QListWidget>
#include <QRadioButton>
#include <QDialog>
#include <QComboBox>
#include <QDesktopServices>
#include <QUrl>
#include <QtCharts/QChartView>
#include <QtCharts/QBarSeries>
#include <QtCharts/QBarSet>
#include <QtCharts/QBarCategoryAxis>
#include <QtCharts/QValueAxis>
#include "Events.h"


EventTableModel::EventTableModel(UserRepository* newRepository) {
    this->repository = newRepository;
}

int EventTableModel::rowCount(const QModelIndex& parent) const
{
    return this->repository->getNumberOfEvents();
}

int EventTableModel::columnCount(const QModelIndex& parent) const
{
    return 5;
}

QVariant EventTableModel::data(const QModelIndex& index, int role) const
{
    if (!index.isValid()) {
        return QVariant();
    }
    int row = index.row();
    Event currentEvent = this->repository->getUserEvents()[row];
    int column = index.column();
    if (role == Qt::DisplayRole) {
        switch (column) {
        case 0: return QString::fromStdString(currentEvent.getTitle());
        case 1: return QString::fromStdString(currentEvent.getDescription());
        case 2: return QString::fromStdString(currentEvent.getDateAndTime());
        case 3: return QString::fromStdString(std::to_string(currentEvent.getPeopleGoing()));
        case 4: return QString::fromStdString(currentEvent.getLink());
        default: break;
        }
    }
    return QVariant();
}

QVariant EventTableModel::headerData(int section, Qt::Orientation orientation, int role) const
{
    if (role == Qt::DisplayRole) {
        if (orientation == Qt::Horizontal) {
            switch (section) {
            case 0:
                return QString("Title");
            case 1:
                return QString("Description");
            case 2:
                return QString("Date");
            case 3:
                return QString("People");
            case 4:
                return QString("Link");
            default:
                break;
            }
        }
    }
    return QVariant();
}

void EventTableModel::update()
{
    if (!this) {
        // Handle the null pointer case, maybe log an error
        return;
    }
    try {
        int rows = this->rowCount();
        int cols = this->columnCount();

        if (rows > 0 && cols > 0) {
            QModelIndex topLeft = this->index(0, 0);
            QModelIndex bottomRight = this->index(rows - 1, cols - 1);
            emit dataChanged(topLeft, bottomRight);
        }
    }
    catch (RepositoryException& re) {
        // Ignore the exception
    }
}


GUI::GUI(Controller& _controller, UserController& _user_controller, Repository& _repo) : controller{ _controller }, user_controller{ _user_controller }, repository{ _repo } {
    this->titleWidget = new QLabel(this);
    this->adminButton = new QPushButton(this);
    this->userButton = new QPushButton(this);
    this->initGUI();
    this->connectSignalsAndSlots();
}

void GUI::initGUI() {
    auto* layout = new QVBoxLayout(this);
    QFont titleFont = this->titleWidget->font();
    this->titleWidget->setText("<p style='text-align:center'><font color=#426a6b>Welcome to Vivid Soirees App! </font></p> <p style='text-align:left'><font color=#426a6b size=2>Select the mode you want to use: </font></p>");
    titleFont.setItalic(true);
    titleFont.setBold(true);
    titleFont.setPointSize(16);
    titleFont.setStyleHint(QFont::Helvetica);
    this->titleWidget->setFont(titleFont);
    this->titleWidget->setStyleSheet("color: #4D2D52");
    layout->addWidget(this->titleWidget);
    this->adminButton->setText("Administrator mode");
    layout->addWidget(this->adminButton);
    this->userButton->setText("User mode");
    layout->addWidget(this->userButton);
    this->setLayout(layout);
    this->setStyleSheet("background-color:#D9DBF1");

    // Create exit button
    QPushButton* exitButton = new QPushButton("Exit");
    layout->addWidget(exitButton);
    QObject::connect(exitButton, &QPushButton::clicked, this, &QWidget::close);

    // Add a logo on the entire window
    QPixmap logo("IMG_3539.png");
    QLabel* logoLabel = new QLabel(this);
    logoLabel->setPixmap(logo);
    layout->addWidget(logoLabel);
    logoLabel->setAlignment(Qt::AlignCenter);
    this->setStyleSheet("background-color:#D9DBF1");
}

GUI::~GUI() = default;

void GUI::connectSignalsAndSlots() {
    QObject::connect(this->adminButton, &QPushButton::clicked, this, &GUI::showAdmin);
    QObject::connect(this->userButton, &QPushButton::clicked, this, &GUI::showUser);
}

void GUI::showAdmin() {
    this->controller.clearUndoRedo();
    auto* admin = new AdminGUI(this, this->controller, this->repository);
    admin->show();
}

AdminGUI::AdminGUI(QWidget* parent, Controller& _controller, Repository& repo) : controller{ _controller }, repository{ repo } {
    this->titleWidget = new QLabel(this);
    this->eventListWidget = new QListWidget{};
    this->titleLineEdit = new QLineEdit{};
    this->descriptionLineEdit = new QLineEdit{};
    this->dateLineEdit = new QLineEdit{};
    this->peopleLineEdit = new QLineEdit{};
    this->linkLineEdit = new QLineEdit{};
    this->addButton = new QPushButton("Add");
    this->deleteButton = new QPushButton("Delete");
    this->updateButton = new QPushButton("Update");
    this->chartButton = new QPushButton("Display chart");

    this->undoButton = new QPushButton("Undo");
    this->redoButton = new QPushButton("Redo");
    this->shortcutUndo = new QShortcut(QKeySequence(Qt::CTRL | Qt::Key_Z), this);
    this->shortcutRedo = new QShortcut(QKeySequence(Qt::CTRL | Qt::Key_Y), this);

    setParent(parent);
    setWindowFlag(Qt::Window);
    this->initAdminGUI();
    this->populateList();
    this->connectSignalsAndSlots();

    // Create exit button
    QPushButton* exitButton = new QPushButton("Exit");
    auto* layout = this->layout();
    layout->addWidget(exitButton);
    QObject::connect(exitButton, &QPushButton::clicked, this, &AdminGUI::close);
}

void AdminGUI::initAdminGUI() {
    auto* layout = new QVBoxLayout(this);
    QFont titleFont = this->titleWidget->font();
    this->titleWidget->setText("<p style='text-align:center'><font color=#426a6b>ADMINISTRATOR MODE</font></p>");
    titleFont.setItalic(true);
    titleFont.setPointSize(10);
    titleFont.setStyleHint(QFont::System);
    this->titleWidget->setFont(titleFont);
    layout->addWidget(this->titleWidget);
    layout->addWidget(this->eventListWidget);

    auto* eventDetailsLayout = new QFormLayout{};
    eventDetailsLayout->addRow("Title", this->titleLineEdit);
    eventDetailsLayout->addRow("Description", this->descriptionLineEdit);
    eventDetailsLayout->addRow("Date", this->dateLineEdit);
    eventDetailsLayout->addRow("People", this->peopleLineEdit);
    eventDetailsLayout->addRow("Link", this->linkLineEdit);
    layout->addLayout(eventDetailsLayout);

    auto* buttonsLayout = new QVBoxLayout{};
    buttonsLayout->addWidget(this->addButton);
    buttonsLayout->addWidget(this->deleteButton);
    buttonsLayout->addWidget(this->updateButton);
    buttonsLayout->addWidget(this->chartButton);
    buttonsLayout->addWidget(this->undoButton);
    buttonsLayout->addWidget(this->redoButton);
    layout->addLayout(buttonsLayout);
}

void AdminGUI::populateList() {
    this->eventListWidget->clear();
    std::vector<Event> allEvents = this->controller.getEventsInController();
    for (Event& event : allEvents)
        this->eventListWidget->addItem(QString::fromStdString(event.getTitle()));
}

void AdminGUI::connectSignalsAndSlots() {
    QObject::connect(this->eventListWidget, &QListWidget::itemSelectionChanged, [this]() {
        std::string event_title = this->eventListWidget->selectedItems().at(0)->text().toStdString();
        int index = this->controller.getEventIndex(event_title);
        Event event = this->controller.getEventsInController()[index];
        this->titleLineEdit->setText(QString::fromStdString(event.getTitle()));
        this->descriptionLineEdit->setText(QString::fromStdString(event.getDescription()));
        this->dateLineEdit->setText(QString::fromStdString(event.getDateAndTime()));
        this->peopleLineEdit->setText(QString::fromStdString(std::to_string(event.getPeopleGoing())));
        this->linkLineEdit->setText(QString::fromStdString(event.getLink()));
        });
    QObject::connect(this->shortcutUndo, &QShortcut::activated, this, &AdminGUI::undoGUI);
    QObject::connect(this->shortcutRedo, &QShortcut::activated, this, &AdminGUI::redoGUI);

    QObject::connect(this->addButton, &QPushButton::clicked, this, &AdminGUI::addEventUI);
    QObject::connect(this->deleteButton, &QPushButton::clicked, this, &AdminGUI::deleteEventUI);
    QObject::connect(this->updateButton, &QPushButton::clicked, this, &AdminGUI::updateEventUI);
    QObject::connect(this->chartButton, &QPushButton::clicked, this, &AdminGUI::displayChart);
    QObject::connect(this->undoButton, &QPushButton::clicked, this, &AdminGUI::undoGUI);
    QObject::connect(this->redoButton, &QPushButton::clicked, this, &AdminGUI::redoGUI);
}

void AdminGUI::addEventUI() {
    // Dialog for adding event
    QDialog* dialog = new QDialog(this);
    dialog->setWindowTitle("Add event");
    auto* layout = new QFormLayout(dialog);
    QLineEdit* titleLineEdit = new QLineEdit(dialog);
    QLineEdit* descriptionLineEdit = new QLineEdit(dialog);
    QLineEdit* dateLineEdit = new QLineEdit(dialog);
    QLineEdit* participantsLineEdit = new QLineEdit(dialog);
    QLineEdit* linkLineEdit = new QLineEdit(dialog);
    layout->addRow("Title", titleLineEdit);
    layout->addRow("Description", descriptionLineEdit);
    layout->addRow("Date", dateLineEdit);
    layout->addRow("Participants", participantsLineEdit);
    layout->addRow("Link", linkLineEdit);
    QPushButton* addButton = new QPushButton("Add", dialog);
    layout->addWidget(addButton);
    QObject::connect(addButton, &QPushButton::clicked, [this, dialog, titleLineEdit, descriptionLineEdit, dateLineEdit, participantsLineEdit, linkLineEdit]() {
        std::string title = titleLineEdit->text().toStdString();
        std::string description = descriptionLineEdit->text().toStdString();
        std::string date = dateLineEdit->text().toStdString();
        std::string participants_s = participantsLineEdit->text().toStdString();
        int participants = stoi(participants_s);
        std::string link = linkLineEdit->text().toStdString();
        try {
            Event event = Event(title, description, date, participants, link);
            this->controller.addEventInController(event);
            this->populateList();
            dialog->close();
        }
        catch (RepositoryException& e) {
            auto* error = new QMessageBox();
            error->setIcon(QMessageBox::Warning);
            error->setText(e.what());
            error->setWindowTitle("Event error!");
            error->exec();
        }
        });
    dialog->exec();
}

void AdminGUI::deleteEventUI() {
    // Dialog for deleting event
    QDialog* dialog = new QDialog(this);
    dialog->setWindowTitle("Delete event");
    auto* layout = new QFormLayout(dialog);
    QLineEdit* titleLineEdit = new QLineEdit(dialog);
    layout->addRow("Title", titleLineEdit);
    QPushButton* deleteButton = new QPushButton("Delete", dialog);
    layout->addWidget(deleteButton);
    QObject::connect(deleteButton, &QPushButton::clicked, [this, dialog, titleLineEdit]() {
        std::string title = titleLineEdit->text().toStdString();
        try {
            this->controller.deleteEventInController(title);
            this->populateList();
            dialog->close();
        }
        catch (RepositoryException& e) {
            auto* error = new QMessageBox();
            error->setIcon(QMessageBox::Warning);
            error->setText(e.what());
            error->setWindowTitle("Event error!");
            error->exec();
        }
        });
    dialog->exec();
}

void AdminGUI::updateEventUI() {
    // Dialog for updating event
    QDialog* dialog = new QDialog(this);
    dialog->setWindowTitle("Update event");
    auto* layout = new QFormLayout(dialog);
    QLineEdit* oldTitleLineEdit = new QLineEdit(dialog);
    QLineEdit* newTitleLineEdit = new QLineEdit(dialog);
    QLineEdit* descriptionLineEdit = new QLineEdit(dialog);
    QLineEdit* dateLineEdit = new QLineEdit(dialog);
    QLineEdit* participantsLineEdit = new QLineEdit(dialog);
    QLineEdit* linkLineEdit = new QLineEdit(dialog);
    layout->addRow("Old title", oldTitleLineEdit);
    layout->addRow("New title", newTitleLineEdit);
    layout->addRow("New description", descriptionLineEdit);
    layout->addRow("New date", dateLineEdit);
    layout->addRow("New number of participants", participantsLineEdit);
    layout->addRow("New link", linkLineEdit);
    QPushButton* updateButton = new QPushButton("Update", dialog);
    layout->addWidget(updateButton);
    QObject::connect(updateButton, &QPushButton::clicked, [this, dialog, oldTitleLineEdit, newTitleLineEdit, descriptionLineEdit, dateLineEdit, participantsLineEdit, linkLineEdit]() {
        std::string old_title = oldTitleLineEdit->text().toStdString();
        std::string new_title = newTitleLineEdit->text().toStdString();
        std::string description = descriptionLineEdit->text().toStdString();
        std::string date = dateLineEdit->text().toStdString();
        std::string participants_s = participantsLineEdit->text().toStdString();
        int participants = stoi(participants_s);
        std::string link = linkLineEdit->text().toStdString();
        try {
            this->controller.updateEventInController(old_title, new_title, description, date, participants, link);
            this->populateList();
            dialog->close();
        }
        catch (RepositoryException& e) {
            auto* error = new QMessageBox();
            error->setIcon(QMessageBox::Warning);
            error->setText(e.what());
            error->setWindowTitle("Event error!");
            error->exec();
        }
        });
    dialog->exec();
}

void AdminGUI::displayChart() {
    this->chartWindow = new QWidget{};
    auto* chartLayout = new QVBoxLayout{ this->chartWindow };
    this->chartWindow->setWindowTitle("Events chart");
    std::vector<Event> events = this->controller.getEventsInController();
    auto* chart = new QChart{};
    auto* axisX = new QBarCategoryAxis{};
    axisX->setTitleText("Events");
    auto* axisY = new QValueAxis{};
    chart->addAxis(axisY, Qt::AlignLeft);
    axisY->setTitleText("People going");
    auto* series = new QBarSeries{};
    QList<QColor> colors = {
        QColor(65, 105, 225), QColor(34, 139, 34), QColor(255, 69, 0),
        QColor(255, 215, 0), QColor(147, 112, 219), QColor(0, 255, 255),
        QColor(255, 0, 255), QColor(255, 165, 0), QColor(165, 42, 42), QColor(255, 192, 203)
    };
    int colorIndex = 0;
    for (const auto& event : events) {
        auto* set = new QBarSet(QString::fromStdString(event.getTitle()));
        *set << event.getPeopleGoing();
        set->setColor(colors[colorIndex % colors.size()]);
        series->append(set);
        colorIndex++;
    }
    // Customize data labels
    series->setLabelsVisible(true);
    series->setLabelsFormat("@value");
    chart->addSeries(series);
    series->attachAxis(axisX);
    series->attachAxis(axisY);
    // Set chart title and animations
    chart->setTitle("Events chart");
    chart->setAnimationOptions(QChart::SeriesAnimations);
    // Customize legend
    chart->legend()->setVisible(true);
    chart->legend()->setAlignment(Qt::AlignBottom);
    chart->legend()->setBackgroundVisible(true);
    chart->legend()->setBorderColor(QColor::fromRgb(171, 147, 225));
    chart->legend()->setFont(QFont("Cambria Math", 7));
    auto* chartView = new QChartView(chart);
    chartView->setRenderHint(QPainter::Antialiasing);
    chartLayout->addWidget(chartView);
    this->chartWindow->showFullScreen();
}

void AdminGUI::undoGUI() {
    try {
        this->controller.undoLastAction();
        this->populateList();
    }
    catch (RepositoryException& re) {
        QMessageBox::critical(this, "Error", re.what());
    }
}

void AdminGUI::redoGUI() {
    try {
        this->controller.redoLastAction();
        this->populateList();
    }
    catch (RepositoryException& re) {
        QMessageBox::critical(this, "Error", re.what());
    }
}

AdminGUI::~AdminGUI() = default;



void GUI::showUser() {
    auto* user = new UserGUI(this, this->controller, this->user_controller);
    user->show();
}

UserGUI::UserGUI(QWidget* parent, Controller& _controller, UserController& _user_controller) : controller{ _controller }, user_controller{ _user_controller }
{
    this->titleWidget = new QLabel(this);
    this->eventListWidget = new QListWidget{};
    this->openFileButton = new QPushButton("Open file");
    this->searchButton = new QPushButton("Search for event");
    this->openListButton = new QPushButton("See your list");
    this->openListTableButton = new QPushButton("See your list in table");
    this->csvButton = new QRadioButton("CSV");
    this->htmlButton = new QRadioButton("HTML");
    this->repoTypeSelected = false;
    setParent(parent);
    setWindowFlag(Qt::Window);
    this->initUserGUI();
    this->populateUserList();
    this->connectSignalsAndSlots();

    // Create exit button
    QPushButton* exitButton = new QPushButton("Exit");
    auto* layout = this->layout();
    layout->addWidget(exitButton);
    QObject::connect(exitButton, &QPushButton::clicked, this, &UserGUI::close);
}

void UserGUI::initUserGUI() {
    auto* layout = new QVBoxLayout(this);
    QFont titleFont = this->titleWidget->font();
    this->titleWidget->setText("<p style='text-align:center'><font color=#426a6b>USER MODE <br> Select the type of file you want for saving your events!</font></p>");
    titleFont.setItalic(true);
    titleFont.setPointSize(10);
    titleFont.setStyleHint(QFont::System);
    this->titleWidget->setFont(titleFont);
    layout->addWidget(this->titleWidget);

    auto* radioButtonsLayout = new QGridLayout(this);
    radioButtonsLayout->addWidget(this->csvButton, 0, 0);
    radioButtonsLayout->addWidget(this->htmlButton, 1, 0);
    radioButtonsLayout->addWidget(this->openFileButton, 0, 1);
    layout->addLayout(radioButtonsLayout);

    auto* eventDetailsLayout = new QFormLayout{};
    eventDetailsLayout->addRow(this->searchButton);
    eventDetailsLayout->addRow(this->openListButton);
    eventDetailsLayout->addRow(this->openListTableButton);
    layout->addLayout(eventDetailsLayout);

    this->wishlistListWidget = new QListWidget{};
}

void UserGUI::createTable() {
    if (!this->listAndTableLayout) {
        this->listAndTableLayout = new QGridLayout();
        this->layout()->addItem(this->listAndTableLayout);
    }

    UserRepository* userRepository = this->user_controller.getUserRepository();
    if (userRepository) {
        if (!this->wishlistListTableModel) {
            this->wishlistListTableModel = new EventTableModel{ userRepository };
        }
        if (!this->wishlistListTable) {
            this->wishlistListTable = new QTableView{};
            this->wishlistListTable->setModel(this->wishlistListTableModel);
        }

        if (this->listAndTableLayout->indexOf(this->wishlistListTable) == -1) {
            this->listAndTableLayout->addWidget(this->wishlistListTable, 0, 1);
        }

        this->wishlistListTable->show();
        this->resize(900, 500);
    }
    else {
        if (this->wishlistListTable) {
            this->listAndTableLayout->removeWidget(this->wishlistListTable);
            this->wishlistListTable->setModel(nullptr);
            this->wishlistListTable->hide();
        }
        this->resize(500, 500);
    }
}

void UserGUI::populateUserList()
{
    this->wishlistListWidget->clear();
    try {
        std::vector<Event> allEvents = this->user_controller.getEventsInUserController();
        for (Event& event : allEvents)
            this->wishlistListWidget->addItem(QString::fromStdString(event.getTitle()));
    }
    catch (UserException& e) {
        // ignore the exception
    }
}

void UserGUI::connectSignalsAndSlots() {
    QObject::connect(this->csvButton, &QRadioButton::clicked, [this]() {
        this->user_controller.repositoryType("CSV");
        this->repoTypeSelected = true;
        });

    QObject::connect(this->htmlButton, &QRadioButton::clicked, [this]() {
        this->user_controller.repositoryType("HTML");
        this->repoTypeSelected = true;
        });

    QObject::connect(this->openFileButton, &QPushButton::clicked, [this]() {
        if (!this->repoTypeSelected) {
            auto* error = new QMessageBox();
            error->setIcon(QMessageBox::Warning);
            error->setText("Please select the type of file you want!");
            error->setWindowTitle("File type warning!");
            error->exec();
        }
        else {
            // Open user's list
            std::string link = std::string("start ").append(this->user_controller.getFileController());
            system(link.c_str());
        }
        });

    QObject::connect(this->searchButton, &QPushButton::clicked, this, &UserGUI::searchEventForUser);
    QObject::connect(this->openListButton, &QPushButton::clicked, this, &UserGUI::openListEventForUser);
    QObject::connect(this->openListTableButton, &QPushButton::clicked, this, &UserGUI::createTable);
}

void UserGUI::searchEventForUser() {
    // Dialog for searching event in user's list by month
    if (!this->repoTypeSelected) {
        auto* error = new QMessageBox();
        error->setIcon(QMessageBox::Warning);
        error->setText("Please select the type of file you want!");
        error->setWindowTitle("File type warning!");
        error->exec();
    }
    else {
        QDialog dialog;
        dialog.setWindowTitle("Search Event");

        // Create buttons for each month
        std::vector<QPushButton*> monthButtons;
        std::vector<std::string> months = { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
        for (const auto& month : months) {
            // Create a button for each month and connect its clicked signal to showEventsForMonth
            QPushButton* button = new QPushButton(QString::fromStdString(month), &dialog);
            button->setFlat(true); // Make the button look like a label
            button->setStyleSheet("text-align:left; color: blue;"); // Change color to indicate it's clickable
            QObject::connect(button, &QPushButton::clicked, [this, month]() {
                try {
                    this->showEventsForMonth(QString::fromStdString(month));
                }
                catch (UserException& e) {
                    auto* error = new QMessageBox();
                    error->setIcon(QMessageBox::Warning);
                    error->setText(e.what());
                    error->setWindowTitle("Event error!");
                    error->exec();
                }
                });
            monthButtons.push_back(button);
        }

        QPushButton* backButton = new QPushButton("Back");

        QVBoxLayout* layout = new QVBoxLayout(&dialog);
        for (auto button : monthButtons) {
            layout->addWidget(button);
        }
        layout->addWidget(backButton);
        dialog.setLayout(layout);

        QObject::connect(backButton, &QPushButton::clicked, &dialog, &QDialog::reject);
        dialog.exec();
    }
}

std::string transformMonth(const QString& month) {
    if (month == "January") return "01";
    if (month == "February") return "02";
    if (month == "March") return "03";
    if (month == "April") return "04";
    if (month == "May") return "05";
    if (month == "June") return "06";
    if (month == "July") return "07";
    if (month == "August") return "08";
    if (month == "September") return "09";
    if (month == "October") return "10";
    if (month == "November") return "11";
    if (month == "December") return "12";
    return "";
}

void UserGUI::showEventsForMonth(const QString& month) {
    // Dialog for showing events of selected month
    std::string monthNumber = transformMonth(month);
    std::vector<Event> events = controller.getEventsByMonthInController(monthNumber);
    QDialog eventDialog;
    eventDialog.setWindowTitle(month + " Events");

    QLabel* titleLabel = new QLabel(&eventDialog);
    QLabel* descriptionLabel = new QLabel(&eventDialog);
    QLabel* dateLabel = new QLabel(&eventDialog);
    QPushButton* openLinkButton = new QPushButton("Open Link", &eventDialog);

    QPushButton* backButton = new QPushButton("Back", &eventDialog);
    QPushButton* nextButton = new QPushButton("Next", &eventDialog);
    QPushButton* addButton = new QPushButton("Add to your list", &eventDialog);

    // Layout
    QVBoxLayout* layout = new QVBoxLayout(&eventDialog);
    layout->addWidget(titleLabel);
    layout->addWidget(descriptionLabel);
    layout->addWidget(dateLabel);
    layout->addWidget(openLinkButton);
    layout->addWidget(backButton);
    layout->addWidget(nextButton);
    layout->addWidget(addButton);

    // Initialize index to display first event
    int currentIndex = 0;
    int size = controller.getNumberOfEventsByMonthInController(monthNumber);

    // Check if there are events to display
    if (!events.empty()) {
        // Display the first event
        displayEvent(events[currentIndex], titleLabel, descriptionLabel, dateLabel, openLinkButton);

        // Connect nextButton to display the next event
        QObject::connect(nextButton, &QPushButton::clicked, [this, &events, &currentIndex, titleLabel, descriptionLabel, dateLabel, openLinkButton, &eventDialog]() {
            // Display next event
            currentIndex++;
            if (currentIndex < events.size()) {
                displayEvent(events[currentIndex], titleLabel, descriptionLabel, dateLabel, openLinkButton);
            }
            else {
                // No more events, close the dialog
                titleLabel->setText("No more events to display");
                eventDialog.reject(); // Close the dialog
            }
            });
        QObject::connect(backButton, &QPushButton::clicked, &eventDialog, &QDialog::reject);
        QObject::connect(addButton, &QPushButton::clicked, [this, &events, &eventDialog, &currentIndex]() {
            // Add event to user's list
            try {
                // Increase the number of people going to the event
                Event event = controller.getEventByTitleInController(events[currentIndex].getTitle());
                controller.updateEventInController(event.getTitle(), event.getTitle(), event.getDescription(), event.getDateAndTime(), event.getPeopleGoing() + 1, event.getLink());
                // Add the event to the user's list
                this->user_controller.addEventInUserController(controller.getEventByTitleInController(events[currentIndex].getTitle()));
                this->wishlistListWidget->addItem(QString::fromStdString(controller.getEventByTitleInController(events[currentIndex].getTitle()).getTitle()));
                this->populateUserList();
            }
            catch (UserException& e) {
                auto* error = new QMessageBox();
                error->setIcon(QMessageBox::Warning);
                error->setText(e.what());
                error->setWindowTitle("Event error!");
                error->exec();
            }
            });
    }
    else {
        // No events to display, close the dialog
        titleLabel->setText("No events to display");
        eventDialog.reject(); // Close the dialog
    }
    eventDialog.exec();
}


void UserGUI::displayEvent(const Event& event, QLabel* titleLabel, QLabel* descriptionLabel, QLabel* dateLabel, QPushButton* openLinkButton) {
    titleLabel->setText(QString::fromStdString(event.getTitle()));
    descriptionLabel->setText(QString::fromStdString(event.getDescription()));
    dateLabel->setText(QString::fromStdString(event.getDateAndTime()));

    QString link = QString::fromStdString(event.getLink());
    // Set up a slot for the openLinkButton to open the link in a browser
    QObject::connect(openLinkButton, &QPushButton::clicked, [=]() {
        QDesktopServices::openUrl(QUrl(link));
        });
}

void UserGUI::openListEventForUser() {
    // Dialog for displaying user's list
    QDialog eventDialog;
    eventDialog.setWindowTitle("Your list");

    QVBoxLayout* layout = new QVBoxLayout(&eventDialog);

    // Assuming this->wishlistListWidget is a QListWidget containing the user's list
    layout->addWidget(this->wishlistListWidget);

    QPushButton* deleteButton = new QPushButton("Delete an event", &eventDialog);
    layout->addWidget(deleteButton);

    // Connect the deleteButton to a lambda function to handle event deletion
    QObject::connect(deleteButton, &QPushButton::clicked, [this, &eventDialog]() {
        // Create a dialog to prompt the user for the title of the event to delete
        QDialog deleteDialog(&eventDialog);
        deleteDialog.setWindowTitle("Delete Event");
        QVBoxLayout* deleteLayout = new QVBoxLayout(&deleteDialog);
        QLabel* titleLabel = new QLabel("Enter the title of the event to delete:", &deleteDialog);
        QLineEdit* titleLineEdit = new QLineEdit(&deleteDialog);
        QPushButton* confirmButton = new QPushButton("Confirm", &deleteDialog);
        deleteLayout->addWidget(titleLabel);
        deleteLayout->addWidget(titleLineEdit);
        deleteLayout->addWidget(confirmButton);
        deleteDialog.setLayout(deleteLayout);

        // Connect the confirmButton to a lambda function to delete the event
        QObject::connect(confirmButton, &QPushButton::clicked, [this, &eventDialog, &deleteDialog, titleLineEdit]() {
            std::string eventTitle = titleLineEdit->text().toStdString();
            // Search for the event with the given title and delete it
            try {
                this->user_controller.deleteEventInUserController(eventTitle);
            }
            catch (UserException& e) {
                auto* error = new QMessageBox();
                error->setIcon(QMessageBox::Warning);
                error->setText(e.what());
                error->setWindowTitle("Event error!");
                error->exec();
            }
            // Close the deleteDialog
            deleteDialog.accept();
            this->populateUserList();
            });

        deleteDialog.exec();
        });

    eventDialog.setLayout(layout);
    eventDialog.exec();
}


UserGUI::~UserGUI() = default;
