/********************************************************************************
** Form generated from reading UI file 'Events.ui'
**
** Created by: Qt User Interface Compiler version 6.7.0
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EVENTS_H
#define UI_EVENTS_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QToolBar>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_EventsClass
{
public:
    QMenuBar *menuBar;
    QToolBar *mainToolBar;
    QWidget *centralWidget;
    QStatusBar *statusBar;

    void setupUi(QMainWindow *EventsClass)
    {
        if (EventsClass->objectName().isEmpty())
            EventsClass->setObjectName("EventsClass");
        EventsClass->resize(600, 400);
        menuBar = new QMenuBar(EventsClass);
        menuBar->setObjectName("menuBar");
        EventsClass->setMenuBar(menuBar);
        mainToolBar = new QToolBar(EventsClass);
        mainToolBar->setObjectName("mainToolBar");
        EventsClass->addToolBar(mainToolBar);
        centralWidget = new QWidget(EventsClass);
        centralWidget->setObjectName("centralWidget");
        EventsClass->setCentralWidget(centralWidget);
        statusBar = new QStatusBar(EventsClass);
        statusBar->setObjectName("statusBar");
        EventsClass->setStatusBar(statusBar);

        retranslateUi(EventsClass);

        QMetaObject::connectSlotsByName(EventsClass);
    } // setupUi

    void retranslateUi(QMainWindow *EventsClass)
    {
        EventsClass->setWindowTitle(QCoreApplication::translate("EventsClass", "Events", nullptr));
    } // retranslateUi

};

namespace Ui {
    class EventsClass: public Ui_EventsClass {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EVENTS_H
