/* Task 1: Open/create file and write strings from user until "-1" */

#include <stdio.h>      // For printf, fprintf, fopen, fclose, fgets
#include <stdlib.h>     // For exit, EXIT_FAILURE
#include <string.h>     // For strcmp, strlen

int main(int argc, char *argv[]) {                     // main gets command line args
    FILE *fp;                                          // File pointer
    char buffer[256];                                  // Buffer to store user input

    if (argc < 2) {                                    // Check if filename is provided
        printf("Usage: %s <filename>\n", argv[0]);    // Inform user about usage
        return 1;                                      // Exit with error code
    }

    fp = fopen(argv[1], "a");                          // Open file for append, create if not exist
    if (fp == NULL) {                                  // Check if file open failed
        perror("fopen");                               // Print system error message
        return EXIT_FAILURE;                           // Exit with failure
    }

    while (1) {                                        // Infinite loop, will break on "-1"
        printf("Enter a string (type -1 to stop): ");  // Prompt user
        if (fgets(buffer, sizeof(buffer), stdin) == NULL) { // Read a line from stdin
            break;                                     // Break if reading fails (EOF)
        }

        // Remove trailing newline if present
        size_t len = strlen(buffer);                   // Get length of input string
        if (len > 0 && buffer[len - 1] == '\n') {      // Check for newline at end
            buffer[len - 1] = '\0';                    // Replace newline with string terminator
        }

        if (strcmp(buffer, "-1") == 0) {               // Compare input with stop condition "-1"
            break;                                     // Exit loop if user entered "-1"
        }

        fprintf(fp, "%s\n", buffer);                   // Write the string to the file with newline
    }

    fclose(fp);                                        // Close the file to flush and release resource
    return 0;                                          // Normal program termination
}


/* Task 2: Parent, child, grandchild printing in order */

#include <stdio.h>          // For printf
#include <unistd.h>         // For fork, getpid, getppid
#include <sys/wait.h>       // For waitpid

int main(void) {
    pid_t pid_child;        // Will store child PID
    pid_t pid_grandchild;   // Will store grandchild PID

    pid_child = fork();     // First fork: create child process

    if (pid_child < 0) {    // Check fork error
        perror("fork");
        return 1;
    }

    if (pid_child == 0) {   // This block runs in child process
        pid_grandchild = fork();    // Second fork: child creates grandchild

        if (pid_grandchild < 0) {   // Check second fork error
            perror("fork");
            return 1;
        }

        if (pid_grandchild == 0) {  // This runs in grandchild process
            printf("I am grandchild\n");   // First line: grandchild prints
            return 0;                      // Grandchild exits
        } else {                     // Back in child process
            waitpid(pid_grandchild, NULL, 0); // Child waits for grandchild to finish
            printf("I am child\n");          // Second line: child prints
            return 0;                        // Child exits
        }
    } else {                        // This block runs in parent process
        waitpid(pid_child, NULL, 0);  // Parent waits for child (and thus grandchild) to finish
        printf("I am parent\n");      // Last line: parent prints
    }

    return 0;                        // Parent exits
}

/* Task 3: Multiple forks, extra child for odd PID, count all processes */

#include <stdio.h>          // For printf
#include <stdlib.h>         // For exit, EXIT_FAILURE
#include <unistd.h>         // For fork, getpid, getppid
#include <sys/wait.h>       // For wait, waitpid
#include <errno.h>          // For errno

int main(void) {
    pid_t a, b, c;          // Variables to store return values of fork calls
    int fd[2];              // Pipe file descriptors: fd[0] for read, fd[1] for write

    if (pipe(fd) == -1) {   // Create pipe for interprocess communication
        perror("pipe");     // Print error if pipe creation fails
        return EXIT_FAILURE;
    }

    a = fork();             // First fork: splits process
    if (a < 0) { perror("fork a"); exit(EXIT_FAILURE); }

    b = fork();             // Second fork: splits each existing process
    if (b < 0) { perror("fork b"); exit(EXIT_FAILURE); }

    c = fork();             // Third fork: splits each existing process again
    if (c < 0) { perror("fork c"); exit(EXIT_FAILURE); }

    if (a > 0 && b > 0 && c > 0) {        // This condition is true only in original parent
        close(fd[1]);                     // Close write end of pipe in parent
        int count = 0;                    // Will count number of processes
        int dummy;                        // Dummy integer for reading
        // Wait until all children (and grandchildren) finish
        while (wait(NULL) != -1 || errno != ECHILD) {
            ;                             // Empty loop body; just waiting
        }

        // Count how many times children wrote into pipe
        while (read(fd[0], &dummy, sizeof(int)) > 0) {  // Read until pipe is empty
            count++;                                    // Each read corresponds to one process
        }
        close(fd[0]);                                   // Close read end of pipe
        printf("Total processes created: %d\n", count); // Print total including first parent
    } else {                                           // This part runs in every child/grandchild
        int x = 1;                                     // Value to write as a token
        write(fd[1], &x, sizeof(int));                 // Each process writes one token to pipe

        pid_t gc = -1;                                 // Will store extra child PID if created
        if (getpid() % 2 == 1) {                       // Check if this process PID is odd
            gc = fork();                               // Create extra child if PID is odd
            if (gc < 0) {                              // Check fork error
                perror("fork extra");
                exit(EXIT_FAILURE);
            }
            if (gc == 0) {                             // In extra child process
                write(fd[1], &x, sizeof(int));         // Extra child also writes one token
                exit(0);                               // Extra child just exits after writing
            }
        }

        if (gc != -1) {                                // If an extra child was created
            waitpid(gc, NULL, 0);                      // Wait for extra child to complete
        }
        close(fd[1]);                                  // Close write end before exit
        exit(0);                                       // Exit child/grandchild
    }

    return 0;                                          // Final parent exit
}

/* Task 4: sort.c - sort numbers from command line in descending order */

// sort.c
#include <stdio.h>          // For printf
#include <stdlib.h>         // For atoi

int main(int argc, char *argv[]) {
    if (argc < 2) {                                         // Validate that numbers are provided
        printf("Usage: %s <num1> <num2> ...\n", argv[0]);   // Print usage message
        return 1;                                           // Exit with error
    }

    int n = argc - 1;                                       // Number of integers
    int arr[n];                                             // Array to hold integers
    for (int i = 0; i < n; i++) {                           // Loop over each number
        arr[i] = atoi(argv[i + 1]);                         // Convert string to int and store
    }

    // Simple bubble sort in descending order
    for (int i = 0; i < n - 1; i++) {                       // Outer loop for passes
        for (int j = 0; j < n - 1 - i; j++) {               // Inner loop for comparisons
            if (arr[j] < arr[j + 1]) {                      // If current is smaller, swap
                int temp = arr[j];                          // Temporary variable for swapping
                arr[j] = arr[j + 1];                        // Move bigger element forward
                arr[j + 1] = temp;                          // Complete the swap
            }
        }
    }

    printf("Sorted (descending): ");                        // Print label
    for (int i = 0; i < n; i++) {                           // Loop through sorted array
        printf("%d ", arr[i]);                              // Print each element
    }
    printf("\n");                                           // Newline after printing

    return 0;                                               // Normal termination
}

/* Task 4: oddeven.c - print odd/even for numbers from command line */

// oddeven.c
#include <stdio.h>          // For printf
#include <stdlib.h>         // For atoi

int main(int argc, char *argv[]) {
    if (argc < 2) {                                         // Ensure numbers are provided
        printf("Usage: %s <num1> <num2> ...\n", argv[0]);   // Usage message
        return 1;                                           // Exit with error
    }

    for (int i = 1; i < argc; i++) {                        // Loop through each argument
        int val = atoi(argv[i]);                            // Convert string to integer
        if (val % 2 == 0) {                                 // Check if number is divisible by 2
            printf("%d is even\n", val);                    // Print even
        } else {
            printf("%d is odd\n", val);                     // Print odd
        }
    }

    return 0;                                               // Normal termination
}

/* Task 4: combined program - child sorts array, parent prints odd/even */

// combined.c
#include <stdio.h>          // For printf
#include <stdlib.h>         // For atoi, qsort
#include <unistd.h>         // For fork
#include <sys/wait.h>       // For waitpid

// Comparison function for qsort to sort in descending order
int cmp_desc(const void *a, const void *b) {        // Takes two generic pointers
    int ia = *(const int *)a;                       // Cast and dereference first int
    int ib = *(const int *)b;                       // Cast and dereference second int
    return ib - ia;                                 // Return positive if ib > ia (descending)
}

int main(int argc, char *argv[]) {
    if (argc < 2) {                                 // Check for at least one number
        printf("Usage: %s <num1> <num2> ...\n", argv[0]);
        return 1;
    }

    int n = argc - 1;                               // Number of integers
    int arr[n];                                     // Array to store them
    for (int i = 0; i < n; i++) {                   // Loop over each argument
        arr[i] = atoi(argv[i + 1]);                 // Convert from string to int
    }

    pid_t pid = fork();                             // Create child process

    if (pid < 0) {                                  // Check fork error
        perror("fork");
        return 1;
    }

    if (pid == 0) {                                 // Child process block
        qsort(arr, n, sizeof(int), cmp_desc);       // Sort the array in descending order
        printf("Child: sorted array (descending): ");
        for (int i = 0; i < n; i++) {               // Print sorted array
            printf("%d ", arr[i]);
        }
        printf("\n");
        return 0;                                   // Child exit
    } else {                                        // Parent process block
        waitpid(pid, NULL, 0);                      // Parent waits for child to complete

        printf("Parent: odd/even status:\n");       // Header for odd/even output
        for (int i = 0; i < n; i++) {               // Loop through the (original) array
            if (arr[i] % 2 == 0) {                  // Check if number is even
                printf("%d is even\n", arr[i]);     // Print even
            } else {
                printf("%d is odd\n", arr[i]);      // Print odd
            }
        }
    }

    return 0;                                       // Program termination
}
/* Task 5: Parent creates one child and three grandchildren, print their IDs */

#include <stdio.h>          // For printf
#include <stdlib.h>         // For exit
#include <unistd.h>         // For fork, getpid, getppid
#include <sys/wait.h>       // For wait, waitpid

int main(void) {
    pid_t pid_child;        // PID for the direct child
    pid_t pid_gc1, pid_gc2, pid_gc3;   // PIDs for the three grandchildren

    printf("Parent process ID: %d\n", getpid());    // Print parent PID

    pid_child = fork();                             // Parent creates one child

    if (pid_child < 0) {                            // Check fork error
        perror("fork");
        exit(1);
    }

    if (pid_child == 0) {                           // This block runs in child process
        printf("Child process ID: %d (parent: %d)\n", getpid(), getppid()); // Print child PID

        // Create first grandchild
        pid_gc1 = fork();                           // Child forks first grandchild
        if (pid_gc1 < 0) { perror("fork gc1"); exit(1); }

        if (pid_gc1 == 0) {                         // First grandchild code
            printf("Grand Child process ID: %d (parent: %d)\n", getpid(), getppid());
            exit(0);                                // First grandchild exits
        }

        // Create second grandchild
        pid_gc2 = fork();                           // Child forks second grandchild
        if (pid_gc2 < 0) { perror("fork gc2"); exit(1); }

        if (pid_gc2 == 0) {                         // Second grandchild code
            printf("Grand Child process ID: %d (parent: %d)\n", getpid(), getppid());
            exit(0);                                // Second grandchild exits
        }

        // Create third grandchild
        pid_gc3 = fork();                           // Child forks third grandchild
        if (pid_gc3 < 0) { perror("fork gc3"); exit(1); }

        if (pid_gc3 == 0) {                         // Third grandchild code
            printf("Grand Child process ID: %d (parent: %d)\n", getpid(), getppid());
            exit(0);                                // Third grandchild exits
        }

        // Child waits for all three grandchildren to finish
        waitpid(pid_gc1, NULL, 0);                  // Wait for first grandchild
        waitpid(pid_gc2, NULL, 0);                  // Wait for second grandchild
        waitpid(pid_gc3, NULL, 0);                  // Wait for third grandchild

        exit(0);                                    // Child exits after grandchildren finish
    } else {                                        // This block runs in original parent
        waitpid(pid_child, NULL, 0);                // Parent waits for child (and all descendants)
    }

    return 0;                                       // Program termination
}

/* Task (No Mutex): Two threads increment a shared counter without synchronization */

#include <stdio.h>                     // For printf
#include <stdlib.h>                    // For general utilities
#include <unistd.h>                    // For POSIX functions (e.g., sleep)
#include <pthread.h>                   // For POSIX threads

int t_id[2] = {1, 2};                  // Thread identifiers 1 and 2
void *t_func(int *id);                 // Prototype of thread function
int count = 0;                         // Shared global counter

int main() {
    pthread_t t[2];                    // Array to hold two thread handles

    pthread_create(&t[0], NULL, (void *)t_func, &t_id[0]); // Create first thread, pass &t_id[0]
    pthread_create(&t[1], NULL, (void *)t_func, &t_id[1]); // Create second thread, pass &t_id[1]

    for (int i = 0; i < 2; i++) {      // Loop to join both threads
        pthread_join(t[i], NULL);      // Wait until thread i finishes
    }

    printf("Total count: %d\n", count); // Print final value of shared counter
    return 0;                          // Normal program termination
}

void *t_func(int *id) {                // Thread function, receives pointer to thread ID
    printf("Entered in Thread %d...\n", *id); // Print which thread started
    for (int i = 0; i < 100000; i++) { // Loop 100000 times
        count++;                       // Increment shared counter (data race here)
        //sleep(1);                    // Optional delay, currently commented out
    }
    return NULL;                       // Return from thread function
}

/* Task (With Mutex): Two threads increment a shared counter with synchronization */

#include <stdio.h>                         // For printf
#include <stdlib.h>                        // For general utilities
#include <unistd.h>                        // For POSIX functions
#include <pthread.h>                       // For POSIX threads

int t_id[2] = {1, 2};                      // Thread identifiers 1 and 2
void *t_func(int *id);                     // Prototype of thread function
int count = 0;                             // Shared global counter
pthread_mutex_t mutex;                     // Mutex to protect access to 'count'

int main() {
    pthread_t t[2];                        // Array to hold two thread handles

    pthread_mutex_init(&mutex, NULL);      // Initialize mutex with default attributes

    pthread_create(&t[0], NULL, (void *)t_func, &t_id[0]); // Create first thread
    pthread_create(&t[1], NULL, (void *)t_func, &t_id[1]); // Create second thread

    for (int i = 0; i < 2; i++) {          // Loop to join both threads
        pthread_join(t[i], NULL);          // Wait until thread i finishes
    }

    pthread_mutex_destroy(&mutex);         // Destroy mutex after all threads are done
    printf("Total count: %d\n", count);    // Print final (synchronized) counter value
    return 0;                              // Normal program termination
}

void *t_func(int *id) {                    // Thread function
    printf("Entered in Thread %d...\n", *id); // Print which thread started
    for (int i = 0; i < 100000; i++) {     // Loop 100000 times
        pthread_mutex_lock(&mutex);        // Lock mutex before modifying shared data
        count++;                           // Safely increment shared counter
        //sleep(1);                        // Optional delay, currently commented out
        pthread_mutex_unlock(&mutex);      // Unlock mutex to allow other thread to proceed
    }
    return NULL;                           // Return from thread function
}

/* Task 1: Four threads increment a shared counter safely using a semaphore */

#include <stdio.h>                     // For printf
#include <stdlib.h>                    // For general utilities
#include <unistd.h>                    // For sleep and POSIX functions
#include <pthread.h>                   // For POSIX threads
#include <semaphore.h>                 // For POSIX semaphores

int t_id[4] = {1, 2, 3, 4};            // Thread IDs for four threads
void *t_func(int *id);                 // Prototype of thread function
int count = 0;                         // Shared global counter
sem_t s;                               // Semaphore to protect 'count'

int main() {
    pthread_t t[4];                    // Array to hold four thread handles

    sem_init(&s, 0, 1);                // Initialize semaphore 's' with value 1 (binary semaphore)

    for (int i = 0; i < 4; i++) {      // Loop to create 4 threads
        pthread_create(&t[i], NULL, (void *)t_func, &t_id[i]); // Create thread i, pass its ID address
    }

    for (int i = 0; i < 4; i++) {      // Loop to join all 4 threads
        pthread_join(t[i], NULL);      // Wait for thread i to finish
    }

    sem_destroy(&s);                   // Destroy semaphore after all threads are done
    printf("Total count: %d\n", count); // Print final value of the shared counter
    return 0;                          // Normal termination
}

void *t_func(int *id) {                // Thread function, receives pointer to thread ID
    printf("Entered in Thread %d...\n", *id); // Print which thread started
    for (int i = 0; i < 100000; i++) { // Loop 100000 times
        sem_wait(&s);                  // Decrement semaphore (enter critical section)
        count++;                       // Safely increment shared counter
        sem_post(&s);                  // Increment semaphore (leave critical section)
    }
    return NULL;                       // Return from thread function
}
/* Task 1: Four threads increment a shared counter safely using a semaphore */

#include <stdio.h>                     // For printf
#include <stdlib.h>                    // For general utilities
#include <unistd.h>                    // For sleep and POSIX functions
#include <pthread.h>                   // For POSIX threads
#include <semaphore.h>                 // For POSIX semaphores

int t_id[4] = {1, 2, 3, 4};            // Thread IDs for four threads
void *t_func(int *id);                 // Prototype of thread function
int count = 0;                         // Shared global counter
sem_t s;                               // Semaphore to protect 'count'

int main() {
    pthread_t t[4];                    // Array to hold four thread handles

    sem_init(&s, 0, 1);                // Initialize semaphore 's' with value 1 (binary semaphore)

    for (int i = 0; i < 4; i++) {      // Loop to create 4 threads
        pthread_create(&t[i], NULL, (void *)t_func, &t_id[i]); // Create thread i, pass its ID address
    }

    for (int i = 0; i < 4; i++) {      // Loop to join all 4 threads
        pthread_join(t[i], NULL);      // Wait for thread i to finish
    }

    sem_destroy(&s);                   // Destroy semaphore after all threads are done
    printf("Total count: %d\n", count); // Print final value of the shared counter
    return 0;                          // Normal termination
}

void *t_func(int *id) {                // Thread function, receives pointer to thread ID
    printf("Entered in Thread %d...\n", *id); // Print which thread started
    for (int i = 0; i < 100000; i++) { // Loop 100000 times
        sem_wait(&s);                  // Decrement semaphore (enter critical section)
        count++;                       // Safely increment shared counter
        sem_post(&s);                  // Increment semaphore (leave critical section)
    }
    return NULL;                       // Return from thread function
}

/* Task 1: Single process with one main thread and one created thread running in parallel */

#include <stdio.h>                      // For printf
#include <stdlib.h>                     // For general utilities
#include <unistd.h>                     // For sleep
#include <pthread.h>                    // For pthread functions

void *funcThread(void *arg);            // Prototype for thread function
void func1();                           // Prototype for normal function

int main() {
    pthread_t t1;                       // Thread handle for created thread

    pthread_create(&t1, NULL, funcThread, NULL); // Create thread t1 running funcThread
    func1();                            // Main thread runs func1 in parallel
    pthread_join(t1, NULL);             // Wait for thread t1 to finish

    return 0;                           // Exit program
}

void func1() {                          // Normal (non-thread) function
    printf("Entered func1:\n");         // Indicate starting func1
    for (int i = 0; i < 5; i++) {       // Loop 5 times
        printf("func1: %d\n", i);       // Print current iteration
        sleep(1);                       // Sleep 1 second
    }
    printf("Done with func 1....\n");   // Indicate func1 is done
}

void *funcThread(void *arg) {           // Thread function
    printf("Entered thread1:\n");       // Indicate starting thread1
    for (int i = 0; i < 5; i++) {       // Loop 5 times
        printf("thread: %d\n", i);      // Print current iteration from thread
        sleep(1);                       // Sleep 1 second
    }
    printf("Done with thread 1....\n"); // Indicate thread work is done
    return NULL;                        // Return from thread function
}

/* Task 2: Thread modifies an integer and returns its new value via pthread_join */

#include <stdio.h>                      // For printf
#include <stdlib.h>                     // For general utilities
#include <unistd.h>                     // For sleep (not used here)
#include <pthread.h>                    // For pthread functions

int *func_thread(int *v);               // Prototype: thread function returns int*
int *t_ret;                             // Pointer to store thread return value

int main2() {
    pthread_t t1;                       // Thread handle
    int n = 5;                          // Initial integer value

    pthread_create(&t1, NULL, (void *)func_thread, &n); // Create thread with &n as argument
    pthread_join(t1, (void **)&t_ret);  // Wait for thread and get its return pointer

    printf("Thread returned: %d\n", (int)(long)t_ret); // Print returned value (cast from pointer)
    return 0;                           // Exit program
}

int *func_thread(int *v) {              // Thread function
    *v = *v * 5;                        // Multiply value by 5
    return (int *)(long)(*v);           // Return it via cast to pointer type
}

/* Task 3: Thread computes square (even) or cube (odd) and returns result via pthread_exit */

#include <stdio.h>                      // For printf
#include <stdlib.h>                     // For general utilities
#include <unistd.h>                     // For sleep (not used here)
#include <pthread.h>                    // For pthread functions

void *func_thread2(int *n);             // Prototype of thread function
void *t_ret2;                           // Pointer to receive thread result
int num = 5;                            // Global initial value

int main3() {
    pthread_t t1;                       // Thread handle

    pthread_create(&t1, NULL, (void *)func_thread2, &num); // Create thread with &num
    pthread_join(t1, &t_ret2);          // Wait for thread, get return value in t_ret2

    printf("Thread returned: %d\n", (int)(long)t_ret2); // Print returned result
    return 0;                           // Exit program
}

void *func_thread2(int *n) {            // Thread function
    printf("Entered in Thread:\n");     // Indicate thread start
    if (*n % 2 == 0) {                  // If number is even
        pthread_exit((void *)(long)(*n * *n)); // Return square via pthread_exit
    } else {                            // If number is odd
        pthread_exit((void *)(long)(*n * *n * *n)); // Return cube
    }
}

/* Task 4: Thread allocates and fills an array, main thread prints the values */

#include <stdio.h>                      // For printf, scanf
#include <stdlib.h>                     // For malloc, free
#include <unistd.h>                     // For sleep (not used here)
#include <pthread.h>                    // For pthread functions

int *func_thread3(int *v);              // Prototype: thread allocates and fills array
int *t_ret3;                            // Pointer to received array

int main4() {
    pthread_t t1;                       // Thread handle
    int n;                              // Size of array

    printf("Enter the size of the array:\n"); // Prompt user
    scanf("%d", &n);                    // Read array size

    pthread_create(&t1, NULL, (void *)func_thread3, &n); // Create thread with &n
    pthread_join(t1, (void **)&t_ret3); // Wait for thread, get pointer to array

    for (int i = 0; i < n; i++) {       // Loop to print array values
        printf("a[%d]: %d\n", i, t_ret3[i]); // Print element i
    }
    free(t_ret3);                       // Free dynamically allocated array

    return 0;                           // Exit program
}

int *func_thread3(int *v) {             // Thread function
    int *a = malloc(sizeof(int) * (*v)); // Allocate array of size *v
    for (int i = 0; i < *v; i++) {      // Loop to fill the array
        printf("Enter value in a[%d]:\n", i); // Prompt for value
        scanf("%d", &a[i]);             // Read value into array
    }
    return a;                           // Return pointer to allocated array
}

/* Task 5: Two threads perform addition and subtraction using passed argument arrays */

#include <stdio.h>                      // For printf
#include <stdlib.h>                     // For general utilities
#include <unistd.h>                     // For sleep
#include <pthread.h>                    // For pthread functions

void *t_func1(void *arg);               // Prototype of first thread function
void *t_func2(void *arg1);              // Prototype of second thread function
int t_id[] = {1, 2};                    // Thread IDs
int a = 10;                             // First operand
int b = 5;                              // Second operand

int main5() {
    int a1[] = {t_id[0], a, b};         // Data array for thread 1: {id, a, b}
    int a2[] = {t_id[1], a, b};         // Data array for thread 2: {id, a, b}
    pthread_t t1;                       // Thread handle 1
    pthread_t t2;                       // Thread handle 2

    pthread_create(&t1, NULL, t_func1, (void *)a1); // Create thread 1 with a1
    pthread_create(&t2, NULL, t_func2, (void *)a2); // Create thread 2 with a2

    pthread_join(t1, NULL);             // Wait for thread 1 to finish
    pthread_join(t2, NULL);             // Wait for thread 2 to finish

    return 0;                           // Exit program
}

void *t_func1(void *arg) {              // Thread 1 function (addition)
    int *x = (int *)arg;                // Cast argument to int pointer
    printf("Entered in Thread :%d\n", x[0]); // Print thread ID from x[0]
    sleep(1);                           // Simulate some work
    int add = x[1] + x[2];              // Compute addition of x[1] and x[2]
    printf("ADD :%d\n", add);           // Print addition result
    printf("Addition Done by Thread %d...\n", x[0]); // Indicate completion
    return NULL;                        // Return from thread
}

void *t_func2(void *arg1) {             // Thread 2 function (subtraction)
    int *y = (int *)arg1;               // Cast argument to int pointer
    printf("Entered in Thread :%d\n", y[0]); // Print thread ID from y[0]
    sleep(1);                           // Simulate some work
    int sub = y[1] - y[2];              // Compute subtraction of y[1] and y[2]
    printf("SUB :%d\n", sub);           // Print subtraction result
    printf("Substraction Done by Thread %d...\n", y[0]); // Indicate completion
    return NULL;                        // Return from thread
}

/* Task 6: Four threads each print their own ID and loop count */

#include <stdio.h>                      // For printf
#include <stdlib.h>                     // For general utilities
#include <unistd.h>                     // For sleep
#include <pthread.h>                    // For pthread functions

int t_id2[] = {1, 2, 3, 4};             // IDs for four threads
void *t_func3(int *id);                 // Prototype for thread function

int main6() {
    pthread_t t[4];                     // Array of 4 thread handles

    for (int i = 0; i < 4; i++) {       // Loop to create 4 threads
        pthread_create(&t[i], NULL, (void *)t_func3, &t_id2[i]); // Each gets its own ID address
    }

    for (int i = 0; i < 4; i++) {       // Loop to join all threads
        pthread_join(t[i], NULL);       // Wait for thread i to finish
    }

    return 0;                           // Exit program
}

void *t_func3(int *id) {                // Thread function
    printf("Entered in Thread %d...\n", *id); // Indicate which thread started
    for (int i = 0; i < 5; i++) {       // Loop 5 times
        printf("Thread %d Turn %d\n", *id, i); // Print ID and loop counter
        sleep(1);                       // Sleep 1 second
    }
    printf("Ending Thread %d...\n", *id); // Indicate thread is ending
    return NULL;                        // Return from thread function
}

