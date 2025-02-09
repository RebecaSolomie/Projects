#include "Events.h"
#include <QtWidgets/QApplication>


int main(int argc, char* argv[])
{
    QApplication a(argc, argv);
    std::vector<Event> adminRepoVector;
    adminRepoVector.reserve(10);
    std::string filename = "events.txt";
    Repository repo{ adminRepoVector, filename };
    repo.initializeRepo();
    Controller controller{ repo };
    UserController userController{ repo };
    GUI gui{ controller, userController, repo };
    gui.show();
    return a.exec();
}
